.SUFFIXES: .js .pegjs .css .html .smcat .svg .png .jpg
PEGJS=node_modules/pegjs/bin/pegjs
ESBUILD=node_modules/.bin/esbuild
HANDLEBARS=node_modules/.bin/handlebars

GENERATED_BASE_SOURCES=src/parse/smcat/smcat-parser.js \
	src/cli/attributes-parser.js \
	src/render/dot/dot.states.template.js \
	src/render/dot/dot.template.js \
	src/render/smcat/smcat.template.js \
	src/render/scxml/scxml.states.template.js \
	src/render/scxml/scxml.template.js

EXTRA_GENERATED_CLI_SOURCES=src/cli/attributes-parser.js

GENERATED_CLI_SOURCES=$(GENERATED_BASE_SOURCES) $(EXTRA_GENERATED_CLI_SOURCES)

EXTRA_GENERATED_PROD_SOURCES=docs/index.html \
	docs/smcat-online-interpreter.min.js \
	docs/inpage.html \
	docs/state-machine-cat-inpage.min.js

GENERATED_PROD_SOURCES=$(GENERATED_BASE_SOURCES) $(EXTRA_GENERATED_PROD_SOURCES)

GENERATED_SOURCES=$(GENERATED_BASE_SOURCES) $(EXTRA_GENERATED_CLI_SOURCES) $(EXTRA_GENERATED_PROD_SOURCES)

# production rules
%-parser.js: peg/%-parser.pegjs
	$(PEGJS) --extra-options-file config/pegjs-config.json -o $@ $<

src/render/%.template.js: src/render/%.template.hbs
	$(HANDLEBARS) --commonjs handlebars/dist/handlebars.runtime -f $@ $<

docs/index.html: docs/index.hbs docs/smcat-online-interpreter.min.js docs/config/prod.json
	node tools/cut-handlebar-cookie.js docs/config/prod.json < $< > $@

docs/inpage.html: docs/inpage.hbs docs/state-machine-cat-inpage.min.js docs/config/inpage-prod.json
	node tools/cut-handlebar-cookie.js docs/config/inpage-prod.json < $< > $@

docs/state-machine-cat-inpage.min.js: docs/state-machine-cat-inpage.js
	$(ESBUILD) $< --platform=browser \
		--bundle \
		--minify \
		--summary \
		--sourcemap \
		--outfile=$@

docs/smcat-online-interpreter.min.js: $(ONLINE_INTERPRETER_SOURCES)
	$(ESBUILD) docs/smcat-online-interpreter.js --platform=browser \
		--bundle \
		--minify \
		--summary \
		--sourcemap \
		--outfile=$@

docs: $(GENERATED_SOURCES)

public:
	mkdir -p $@

public/samples:
	mkdir -p $@

public/%: docs/%
	cp $< $@

%.gz: %
	gzip --best --stdout $< > $@

# executable targets
clean:
	rm -rf $(GENERATED_SOURCES)
	rm -rf coverage
	rm -rf public

cli-build: $(GENERATED_CLI_SOURCES)

dist: $(GENERATED_CLI_SOURCES) $(GENERATED_PROD_SOURCES)

pages: dist \
	public \
	public/index.html \
	public/index.html.gz \
	public/inpage.html \
	public/inpage.html.gz \
	public/smcat-online-interpreter.min.js \
	public/smcat-online-interpreter.min.js.gz \
	public/state-machine-cat-inpage.min.js \
	public/state-machine-cat-inpage.min.js.gz \
	public/samples \
	public/samples/on-off.smcat \
	public/samples/on-off.smcat.gz \
	public/samples/cat.smcat \
	public/samples/cat.smcat.gz \
	public/samples/sprint-states.smcat \
	public/samples/sprint-states.smcat.gz \
	public/samples/sprint-states.scxml \
	public/samples/sprint-states.scxml.gz \
	public/samples/vscode-issues-triaging.smcat \
	public/samples/vscode-issues-triaging.smcat.gz \
	public/samples/tcp.smcat \
	public/samples/tcp.smcat.gz \
	public/samples/mediaplayer.smcat \
	public/samples/mediaplayer.smcat.gz \
	public/samples/phone.smcat \
	public/samples/phone.smcat.gz \
	public/samples/karl.smcat \
	public/samples/karl.smcat.gz \
	public/samples/parallel.smcat \
	public/samples/parallel.smcat.gz \
	public/samples/bitbitggeranonymized.smcat \
	public/samples/bitbitggeranonymized.smcat.gz \
	public/samples/empty.smcat \
	public/samples/empty.smcat.gz \
	public/samples/cheatsheet.smcat \
	public/samples/cheatsheet.smcat.gz \
	public/samples/cassetteplayer.smcat \
	public/samples/cassetteplayer.smcat.gz \
	public/samples/DHCP.smcat \
	public/samples/DHCP.smcat.gz \
	public/samples/PDSA.smcat \
	public/samples/PDSA.smcat.gz \
	public/samples/kitchensink.smcat \
	public/samples/kitchensink.smcat.gz

