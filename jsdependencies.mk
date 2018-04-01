
# DO NOT DELETE THIS LINE -- js-makedepend depends on it.

# cjs dependencies
src/cli/actions.js: \
	src/cli/streamstuff/fileNameToStream.js \
	src/cli/streamstuff/readFromStream.js \
	src/index.js

src/index.js: \
	package.json \
	src/options.js \
	src/parse/index.js \
	src/render/dot/index.js \
	src/render/html/index.js \
	src/render/scjson.js \
	src/render/scxml/index.js \
	src/render/smcat/index.js \
	src/render/svg.js

src/parse/index.js: \
	src/options.js \
	src/parse/smcat-ast.schema.json \
	src/parse/smcat-parser.js

src/render/dot/index.js: \
	src/render/dot/astMassage.js \
	src/render/dot/counter.js \
	src/render/dot/dot.states.template.js \
	src/render/dot/dot.template.js \
	src/render/utl.js

src/render/dot/astMassage.js: \
	src/render/utl.js

src/render/html/index.js: \
	src/render/html/ast2Matrix.js \
	src/render/html/html.template.js \
	src/render/utl.js

src/render/html/ast2Matrix.js: \
	src/render/utl.js

src/render/scjson.js: \
	src/render/dot/astMassage.js

src/render/scxml/index.js: \
	src/render/scjson.js \
	src/render/scxml/scxml.states.template.js \
	src/render/scxml/scxml.template.js

src/render/smcat/index.js: \
	src/render/smcat/smcat.template.js

src/render/svg.js: \
	src/options.js \
	src/render/dot/index.js

src/cli/validations.js: \
	src/index.js

# cjs dependencies
test/cli/actions.spec.js: \
	src/cli/actions.js

src/cli/actions.js: \
	src/cli/streamstuff/fileNameToStream.js \
	src/cli/streamstuff/readFromStream.js \
	src/index.js

src/index.js: \
	package.json \
	src/options.js \
	src/parse/index.js \
	src/render/dot/index.js \
	src/render/html/index.js \
	src/render/scjson.js \
	src/render/scxml/index.js \
	src/render/smcat/index.js \
	src/render/svg.js

src/parse/index.js: \
	src/options.js \
	src/parse/smcat-ast.schema.json \
	src/parse/smcat-parser.js

src/render/dot/index.js: \
	src/render/dot/astMassage.js \
	src/render/dot/counter.js \
	src/render/dot/dot.states.template.js \
	src/render/dot/dot.template.js \
	src/render/utl.js

src/render/dot/astMassage.js: \
	src/render/utl.js

src/render/html/index.js: \
	src/render/html/ast2Matrix.js \
	src/render/html/html.template.js \
	src/render/utl.js

src/render/html/ast2Matrix.js: \
	src/render/utl.js

src/render/scjson.js: \
	src/render/dot/astMassage.js

src/render/scxml/index.js: \
	src/render/scjson.js \
	src/render/scxml/scxml.states.template.js \
	src/render/scxml/scxml.template.js

src/render/smcat/index.js: \
	src/render/smcat/smcat.template.js

src/render/svg.js: \
	src/options.js \
	src/render/dot/index.js

test/cli/normalizations.spec.js: \
	src/cli/normalizations.js

test/cli/streamstuff/fileNameToStream.spec.js: \
	src/cli/streamstuff/fileNameToStream.js \
	test/cli/streamstuff/utl.js

test/cli/streamstuff/readFromStream.spec.js: \
	src/cli/streamstuff/readFromStream.js

test/cli/validations.spec.js: \
	src/cli/validations.js

src/cli/validations.js: \
	src/index.js

test/index.spec.js: \
	package.json \
	src/index.js

test/parse/smcat-parser.spec.js: \
	src/parse/smcat-ast.schema.json \
	src/parse/smcat-parser.js \
	test/parse/00-no-transitions.json \
	test/parse/01-transitions-only.json \
	test/parse/02-comments.json \
	test/parse/03-composite.json \
	test/parse/10-no-transitions-errors.json \
	test/parse/11-transition-errors.json \
	test/parse/12-composition-errors.json \
	test/parse/fixtures/kitchensink.json

test/render/dot/astMassage.spec.js: \
	src/render/dot/astMassage.js \
	test/render/dot/astMassage-01-flattenStates.json \
	test/render/dot/astMassage-02-findStateByName.json \
	test/render/dot/astMassage-03-flattenTransitions.json

test/render/dot/counter.spec.js: \
	src/render/dot/counter.js

test/render/dot.spec.js: \
	src/render/dot/index.js

test/render/html/ast2Matrix.spec.js: \
	src/render/html/ast2Matrix.js \
	test/render/html/ast2AdjecencyMatrix.json \
	test/render/html/ast2IncidenceMatrix.json \
	test/render/html/ast2transitionLabelMatrix.json

test/render/html.spec.js: \
	src/render/html/index.js

test/render/json.spec.js: \
	src/parse/smcat-ast.schema.json \
	src/parse/smcat-parser.js

test/render/scjson.spec.js: \
	src/parse/scjson.schema.json \
	src/render/scjson.js

test/render/scxml.spec.js: \
	src/render/scxml/index.js

test/render/smcat.spec.js: \
	src/parse/smcat-parser.js \
	src/render/smcat/index.js \
	test/parse/00-no-transitions.json \
	test/parse/01-transitions-only.json \
	test/parse/03-composite.json

test/render/svg.spec.js: \
	src/render/svg.js

# cjs dependencies
ONLINE_INTERPRETER_SOURCES=docs/smcat-online-interpreter.js \
	package.json \
	src/index.js \
	src/options.js \
	src/parse/index.js \
	src/parse/smcat-ast.schema.json \
	src/parse/smcat-parser.js \
	src/render/dot/astMassage.js \
	src/render/dot/counter.js \
	src/render/dot/dot.states.template.js \
	src/render/dot/dot.template.js \
	src/render/dot/index.js \
	src/render/html/ast2Matrix.js \
	src/render/html/html.template.js \
	src/render/html/index.js \
	src/render/scjson.js \
	src/render/scxml/index.js \
	src/render/scxml/scxml.states.template.js \
	src/render/scxml/scxml.template.js \
	src/render/smcat/index.js \
	src/render/smcat/smcat.template.js \
	src/render/svg.js \
	src/render/utl.js
