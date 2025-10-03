ELMS=$(shell find src/ -type f -name '*.elm')

PROJECT_ROOT=..

OPTIMIZE=--optimize

$(PROJECT_ROOT)/material/static/package/configure.mjs: dist/configure-package.mjs
	@cp $< $@

dist/configure-package.mjs: dist/app.js embed-app.js
	@awk 1 $^ > $@

dist/app.js: src/ChirunPackageConfig.elm $(ELMS)
	-elm make $(OPTIMIZE) $< --output=$@
	@sed -i 's/(this));$$/(window));/' $@	# Make the compiled Elm script work as an ES6 module
