from   .models import Compilation
from   asgiref.sync import async_to_sync
import asyncio
from   channels.layers import get_channel_layer
from   chirun_lti.cache import get_cache
from   django.conf import settings
from   django.utils.timezone import now
from   huey.contrib.djhuey import task
import shutil
import subprocess
import tempfile

@task()
def build_package(compilation):
    """
        Build a package, and record the results in the given Compilation object.

        Plan:
        * Create temporary directories to copy the source files to, and to store the output in.
        * Run chirun, either as a local command or through Docker, on the source directory.
        * Feed STDERR and STDOUT from the command to corresponding channel groups, to be passed through to websockets, as well as saving the whole output in the cache so in-progress logs can be restored on page reload.
        * Wait until the build has finished.
        * Copy the output to the package's permanent output directory.
        * Save the STDERR and STDOUT logs to the Compilation object.
    """
    package = compilation.package

    print(f"Task to build {package}")

    async def do_build(source_path, output_path):
        cache = get_cache()

        channel_layer = get_channel_layer()

        shutil.copytree(package.absolute_extracted_path, source_path, dirs_exist_ok=True)

        use_docker = hasattr(settings,'CHIRUN_DOCKER_IMAGE')

        chirun_output_path = '/opt/chirun-output' if use_docker else output_path
        working_directory = '/opt/chirun-source' if use_docker else source_path

        cmd = [ 
            'chirun',
            '-vv',
            '-o',
            chirun_output_path,
        ]

        if use_docker:
            cmd = [
                'docker',
                'run',
                '--rm',
                '-v',
                str(source_path.resolve()) + ':/opt/chirun-source',
                '-v',
                str(output_path.resolve()) + ':/opt/chirun-output',
                '-w',
                '/opt/chirun-source',
                settings.CHIRUN_DOCKER_IMAGE,
            ] + cmd

        cache_key = compilation.get_cache_key()
        stdout_cache_key = cache_key + '_stdout'
        stderr_cache_key = cache_key + '_stderr'
        channel_group_name = compilation.get_channel_group_name()

        async def read(pipe, pipe_name):
            out = b''
            part = b''
            count = 0
            while True:
                buf = await pipe.read(10)
                if not buf:
                    break

                part += buf
                if b'\n' in buf:
                    out += part
                    await cache.set(cache_key+'_pipe_name', out)

                    count += 1

                    await channel_layer.group_send(
                        channel_group_name, {"type": f'{pipe_name}_bytes', "bytes": part, "count": count,}
                    )

                    part = b''

            return out

        process = await asyncio.create_subprocess_exec(
            *cmd,
            cwd = working_directory,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )

        stdout_bytes, stderr_bytes = await asyncio.gather(
            read(process.stdout, 'stdout'),
            read(process.stderr, 'stderr')
        )

        from pathlib import Path

        shutil.copytree(output_path, package.absolute_output_path, dirs_exist_ok=True)

        await process.communicate()

        stdout = stdout_bytes.decode('utf-8')
        stderr = stderr_bytes.decode('utf-8')

        await cache.delete(stdout_cache_key)
        await cache.delete(stderr_cache_key)

        compilation.output = stdout+'\n\n'+stderr
        if process.returncode == 0:
            compilation.status = 'built'
        else:
            compilation.status = 'error'

        compilation.end_time = now()

        time_taken = compilation.end_time - compilation.start_time

        await channel_layer.group_send(
                channel_group_name, {"type": "finished", "status": compilation.status, 'end_time': compilation.end_time.isoformat(), 'time_taken': time_taken.total_seconds()}
        )

    with tempfile.TemporaryDirectory() as source_path, tempfile.TemporaryDirectory() as output_path:
        async_to_sync(do_build)(source_path, output_path)


    print(f"Finished building {package}: {compilation}")
    compilation.save()

@task()
def delete_package_files(package):
    shutil.rmtree(package.absolute_extracted_path)
    shutil.rmtree(package.absolute_output_path)
