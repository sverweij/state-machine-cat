.SUFFIXES: .js .pegjs .css .html .smcat .svg .png .jpg
PEGJS=node_modules/pegjs/bin/pegjs
GIT=git
NPM=npm
MAKEDEPEND=node_modules/.bin/js-makedepend --output-to jsdependencies.mk --exclude "node_modules|docs"
WEBPACK=node_modules/.bin/webpack
RJS=node_modules/.bin/r.js

GENERATED_SOURCES=src/parse/smcat-parser.js \
	src/render/dot.states.template.js \
	src/render/dot.template.js \
	src/render/smcat.template.js \
	src/render/HTMLTable.template.js

dev-build: src/index.js src/lib/viz.js/viz.js docs/lib docs/lib/require.js .npmignore

# production rules
src/parse/%-parser.js: src/parse/peg/%-parser.pegjs
	$(PEGJS) --format umd -o $@ $<

src/lib/viz.js/viz.js: node_modules/viz.js/viz.js
	cp $< $@

src/lib/handlebars.runtime.js: node_modules/handlebars/dist/handlebars.runtime.js
	cp $< $@

src/render/%.template.js: src/render/%.template.hbs
	handlebars --amd -h "../lib/" -f $@ $<
	sh utl/amdefinify.sh $@

public public/lib docs/lib:
	mkdir -p $@

public/smcat-online-interpreter.js: $(ONLINE_INTERPRETER_SOURCES)
	$(RJS) -o baseUrl="./docs" \
			name="smcat-online-interpreter" \
			out=$@ \
			preserveLicenseComments=true

public/index.html: docs/index.html public/smcat-online-interpreter.js public/lib/require.js
	cp $< $@

docs/lib/require.js: node_modules/requirejs/require.js
	cp $< $@

public/lib/require.js: docs/lib/require.js
	cp $< $@

.npmignore: .gitignore
	cp $< $@
	echo "docs/**" >> $@
	echo "test/**" >> $@
	echo "utl/**" >> $@
	echo ".bithoundrc" >> $@
	echo ".eslintignore" >> $@
	echo ".eslintrc.json" >> $@
	echo ".gitlab-ci.yml" >> $@
	echo ".istanbul.yml" >> $@
	echo "Makefile" >> $@
	echo "jsdependencies.mk" >> $@

# dependencies
include jsdependencies.mk

# executable targets
depend:
	$(MAKEDEPEND) --system amd,cjs src
	$(MAKEDEPEND) --append --system amd,cjs test
	$(MAKEDEPEND) --append --system amd --flat-define ONLINE_INTERPRETER_SOURCES docs/smcat-online-interpreter.js

tag:
	$(GIT) tag -a `utl/getver` -m "tag release `utl/getver`"
	$(GIT) push --tags

clean:
	rm -rf $(GENERATED_SOURCES)
	rm -rf coverage
	rm -rf public

check: dev-build
	$(NPM) run lint
	$(NPM) run depcruise
	$(NPM) run nsp
	$(NPM) test
	$(NPM) outdated

lint-fix:
	$(NPM) run lint:fix

install:
	$(NPM) install

pages: install dev-build public/lib public/index.html

update-dependencies: run-update-dependencies clean dev-build check lint-fix
	$(GIT) diff package.json

run-update-dependencies:
	$(NPM) run npm-check-updates
	$(NPM) install
