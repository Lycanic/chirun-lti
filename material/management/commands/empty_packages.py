from collections import defaultdict
from django.core.management.base import BaseCommand
from django.db.models import OuterRef, Subquery, Q
from django.utils.timezone import now
from datetime import timedelta
from material.models import ChirunPackage, Compilation
import random

def empty_package(p):
    return not any(f.name != 'config.yml' for f in p.absolute_extracted_path.iterdir())

class Command(BaseCommand):
    help = 'Find packages which have never been built and have no source files'

    def add_arguments(self, parser):
        parser.add_argument('--delete', action='store_true', help="Delete empty packages")
        parser.add_argument('--print-uids', action='store_true', help="Print the UIDs of empty packages")

    def handle(self, *args, **options):
        packages = ChirunPackage.objects.filter(compilations=None,launches=None, lti_uses=None, created__lt=now() - timedelta(days=3)) \
            .exclude(git_interactions__status='success') \
            .filter(
                Q(git_url='', git_interactions=None) 
              | Q(git_interactions__status='error')
            )
    
        bads = [p for p in packages if empty_package(p)]

        print(f"There are {len(bads)} packages which seem to be empty.\n")

        if options['print_uids']:
            print("Here are their UIDs:\n")
            for p in bads:
                print(p.uid)

        if options['delete']:
            print("Deleting those packages")
            uids = [p.uid for p in bads]
            res = ChirunPackage.objects.filter(uid__in=uids).delete()
            print(res)
        else:
            print("Here's a random sample of empty-seeming packages:\n")
            for p in random.sample(bads, 5):
                print(f"""{p.get_absolute_url()}
    Git URL: {p.git_url}
""")

