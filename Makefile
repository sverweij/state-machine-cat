.SUFFIXES: .cjs .peggy .css .html .smcat .svg .png .jpg
PEGGY=node_modules/peggy/bin/peggy.js
ESBUILD=node_modules/.bin/esbuild
GRAMMKIT=node_modules/.bin/grammkit

GENERATED_BASE_SOURCES=src/parse/smcat/smcat-parser.mjs \
	src/parse/smcat-ast.schema.mts \
	src/version.mts

EXTRA_GENERATED_CLI_SOURCES=src/cli/attributes-parser.mjs

GENERATED_CLI_SOURCES=$(GENERATED_BASE_SOURCES) $(EXTRA_GENERATED_CLI_SOURCES)

GENERATED_GRAMMAR_DOC=docs/grammar.html

EXTRA_GENERATED_PROD_SOURCES=docs/index.html \
	docs/smcat-online-interpreter.min.js \
	docs/inpage.html \
	docs/state-machine-cat-inpage.min.js

GENERATED_PROD_SOURCES=$(GENERATED_BASE_SOURCES) $(EXTRA_GENERATED_PROD_SOURCES) $(GENERATED_GRAMMAR_DOC)

GENERATED_SOURCES=$(GENERATED_BASE_SOURCES) $(EXTRA_GENERATED_CLI_SOURCES) $(EXTRA_GENERATED_PROD_SOURCES) 

# production rules
%smcat-parser.mjs: %peg/smcat-parser.peggy
	$(PEGGY) --extra-options-file config/peggy-config-smcat-parser.json -o $@ $<

%attributes-parser.mjs: %peg/attributes-parser.peggy
	$(PEGGY) --extra-options-file config/peggy-config-attributes-parser.json -o $@ $<

src/version.mts: package.json
	npx tsx tools/get-version.mts > $@

src/parse/smcat-ast.schema.mts: tools/smcat-ast.schema.json
	npx tsx tools/js-json.mts < $< > $@

docs/index.html: docs/index.hbs docs/smcat-online-interpreter.min.js docs/config/prod.json tools/template-to-html.mts
	npx tsx tools/template-to-html.mts docs/config/prod.json < $< > $@

docs/inpage.html: docs/inpage.hbs docs/state-machine-cat-inpage.min.js docs/config/inpage-prod.json tools/template-to-html.mts
	npx tsx tools/template-to-html.mts docs/config/inpage-prod.json < $< > $@

docs/state-machine-cat-inpage.min.js: docs/state-machine-cat-inpage.js
	$(ESBUILD) $< \
		--platform=browser \
		--bundle \
		--format=esm \
		--minify \
		--sourcemap \
		--legal-comments=external \
		--outfile=$@

docs/smcat-online-interpreter.min.js: $(ONLINE_INTERPRETER_SOURCES)
	$(ESBUILD) docs/smcat-online-interpreter.js \
		--platform=browser \
		--bundle \
		--format=esm \
		--minify \
		--sourcemap \
		--legal-comments=external \
		--outfile=$@

docs/grammar.html: src/parse/smcat/peg/smcat-parser.peggy
	$(GRAMMKIT) --output-format html --output $@ $<

docs: $(GENERATED_SOURCES)

dist:
	mkdir -p $@

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
	rm -rf dist
	rm -f docs/grammar.html

cli-build: $(GENERATED_CLI_SOURCES)

distro: $(GENERATED_CLI_SOURCES) $(GENERATED_PROD_SOURCES)

pages: distro \
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
	public/samples/desugarable.smcat \
	public/samples/desugarable.smcat.gz \
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

