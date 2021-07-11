.SUFFIXES: .js .peggy .css .html .smcat .svg .png .jpg
PEGGY=node_modules/peggy/bin/peggy
ESBUILD=node_modules/.bin/esbuild
HANDLEBARS=node_modules/.bin/handlebars

GENERATED_BASE_SOURCES=src/parse/smcat/smcat-parser.js \
	src/parse/smcat-ast.schema.js \
	src/cli/attributes-parser.js \
	src/render/dot/dot.states.template.cjs \
	src/render/dot/dot.template.cjs \
	src/render/smcat/smcat.template.cjs \
	src/render/scxml/scxml.states.template.cjs \
	src/render/scxml/scxml.template.cjs \
	src/version.js \
	dist/commonjs/bundle.cjs

EXTRA_GENERATED_CLI_SOURCES=src/cli/attributes-parser.js

GENERATED_CLI_SOURCES=$(GENERATED_BASE_SOURCES) $(EXTRA_GENERATED_CLI_SOURCES)

EXTRA_GENERATED_PROD_SOURCES=docs/index.html \
	docs/smcat-online-interpreter.min.js \
	docs/inpage.html \
	docs/state-machine-cat-inpage.min.js

GENERATED_PROD_SOURCES=$(GENERATED_BASE_SOURCES) $(EXTRA_GENERATED_PROD_SOURCES)

GENERATED_SOURCES=$(GENERATED_BASE_SOURCES) $(EXTRA_GENERATED_CLI_SOURCES) $(EXTRA_GENERATED_PROD_SOURCES)

# production rules
%smcat-parser.js: %peg/smcat-parser.peggy
	$(PEGGY) --extra-options-file config/peggy-config-smcat-parser.json -o $@ $<

%attributes-parser.js: %peg/attributes-parser.peggy
	$(PEGGY) --extra-options-file config/peggy-config-attributes-parser.json -o $@ $<

src/render/%.template.cjs: src/render/%.template.hbs
	$(HANDLEBARS) --commonjs handlebars/dist/handlebars.runtime -f $@ $<

src/version.js: package.json
	node tools/get-version.js > $@

src/parse/smcat-ast.schema.js: tools/smcat-ast.schema.json
	node tools/js-json.js < $< > $@

docs/index.html: docs/index.hbs docs/smcat-online-interpreter.min.js docs/config/prod.json
	node tools/cut-handlebar-cookie.cjs docs/config/prod.json < $< > $@

docs/inpage.html: docs/inpage.hbs docs/state-machine-cat-inpage.min.js docs/config/inpage-prod.json tools/cut-handlebar-cookie.cjs
	node tools/cut-handlebar-cookie.cjs docs/config/inpage-prod.json < $< > $@

dist/commonjs/bundle.cjs: src/index.js src/version.js
	$(ESBUILD) src/index.js \
		--format=cjs \
		--target=node12 \
		--bundle \
		--external:{ajv,chalk,commander,fast-xml-parser,get-stream,handlebars,he,indent-string,lodash.*,semver,viz.js,wrap-ansi} \
		--global-name=smcjs \
		--minify \
		--outfile=$@

docs/state-machine-cat-inpage.min.js: docs/state-machine-cat-inpage.js
	$(ESBUILD) $< \
		--platform=browser \
		--bundle \
		--format=esm \
		--minify \
		--sourcemap \
		--outfile=$@

docs/smcat-online-interpreter.min.js: $(ONLINE_INTERPRETER_SOURCES)
	$(ESBUILD) docs/smcat-online-interpreter.js \
		--platform=browser \
		--bundle \
		--format=esm \
		--minify \
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

cli-build: $(GENERATED_CLI_SOURCES) dist/commonjs/bundle.cjs

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

