.SUFFIXES: .js .pegjs .css .html .msc .mscin .msgenny .svg .png .jpg
PEGJS=node_modules/pegjs/bin/pegjs
GIT=git
NPM=npm
MAKEDEPEND=node_modules/.bin/js-makedepend --output-to jsdependencies.mk --exclude "node_modules|doc"

GENERATED_SOURCES=src/parse/stategenny-parser.js

dev-build: src/index.js src/lib/viz.js/viz.js

# production rules
src/parse/%-parser.js: src/parse/peg/%-parser.pegjs
	$(PEGJS) --format umd -o $@ $<

src/lib/viz.js/viz.js: node_modules/viz.js/viz.js
	cp $< $@

# dependencies
include jsdependencies.mk

depend:
	$(MAKEDEPEND) --system amd,cjs src
	$(MAKEDEPEND) --append --system amd,cjs test

clean: 
	rm -rf $(GENERATED_SOURCES)
	rm -rf coverage

check:
	$(NPM) run lint
	$(NPM) run nsp
	$(NPM) test
	$(NPM) outdated

update-dependencies: run-update-dependencies clean dev-build check
	$(GIT) diff package.json

run-update-dependencies:
	$(NPM) run npm-check-updates
	$(NPM) install
