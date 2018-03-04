
# DO NOT DELETE THIS LINE -- js-makedepend depends on it.

# cjs dependencies
src/cli/actions.js: \
	src/cli/streamstuff/fileNameToStream.js \
	src/cli/streamstuff/readFromStream.js \
	src/index.js

src/index.js: \
	package.json \
	src/parse/smcat-ast.schema.json \
	src/parse/smcat-parser.js \
	src/render/ast2HTMLTable.js \
	src/render/ast2dot.js \
	src/render/ast2scjson.js \
	src/render/ast2scxml.js \
	src/render/ast2smcat.js

src/render/ast2HTMLTable.js: \
	src/render/HTMLTable.template.js \
	src/render/ast2Matrix.js \
	src/render/utl.js

src/render/ast2Matrix.js: \
	src/render/utl.js

src/render/ast2dot.js: \
	src/render/astMassage.js \
	src/render/counter.js \
	src/render/dot.states.template.js \
	src/render/dot.template.js \
	src/render/utl.js

src/render/astMassage.js: \
	src/render/utl.js

src/render/ast2scxml.js: \
	src/render/ast2scjson.js \
	src/render/scxml.template.js

src/render/ast2smcat.js: \
	src/render/smcat.template.js

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
	src/parse/smcat-ast.schema.json \
	src/parse/smcat-parser.js \
	src/render/ast2HTMLTable.js \
	src/render/ast2dot.js \
	src/render/ast2scjson.js \
	src/render/ast2scxml.js \
	src/render/ast2smcat.js

src/render/ast2HTMLTable.js: \
	src/render/HTMLTable.template.js \
	src/render/ast2Matrix.js \
	src/render/utl.js

src/render/ast2Matrix.js: \
	src/render/utl.js

src/render/ast2dot.js: \
	src/render/astMassage.js \
	src/render/counter.js \
	src/render/dot.states.template.js \
	src/render/dot.template.js \
	src/render/utl.js

src/render/astMassage.js: \
	src/render/utl.js

src/render/ast2scxml.js: \
	src/render/ast2scjson.js \
	src/render/scxml.template.js

src/render/ast2smcat.js: \
	src/render/smcat.template.js

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
	test/parse/12-composition-errors.json

test/render/ast2HTMLTable.spec.js: \
	src/render/ast2HTMLTable.js

test/render/ast2Matrix.spec.js: \
	src/render/ast2Matrix.js \
	test/render/ast2AdjecencyMatrix.json \
	test/render/ast2IncidenceMatrix.json \
	test/render/ast2transitionLabelMatrix.json

test/render/ast2dot.spec.js: \
	src/render/ast2dot.js

test/render/ast2scjson.js: \
	src/parse/scjson.schema.json \
	src/render/ast2scjson.js

test/render/ast2scxml.js: \
	src/render/ast2scxml.js

test/render/ast2smcat.spec.js: \
	src/parse/smcat-parser.js \
	src/render/ast2smcat.js \
	test/parse/00-no-transitions.json \
	test/parse/01-transitions-only.json \
	test/parse/03-composite.json

test/render/astMassage.spec.js: \
	src/render/astMassage.js \
	test/render/astMassage-01-flattenStates.json \
	test/render/astMassage-02-findStateByName.json \
	test/render/astMassage-03-flattenTransitions.json

test/render/counter.spec.js: \
	src/render/counter.js

# cjs dependencies
ONLINE_INTERPRETER_SOURCES=docs/smcat-online-interpreter.js \
	package.json \
	src/index.js \
	src/parse/smcat-ast.schema.json \
	src/parse/smcat-parser.js \
	src/render/HTMLTable.template.js \
	src/render/ast2HTMLTable.js \
	src/render/ast2Matrix.js \
	src/render/ast2dot.js \
	src/render/ast2scjson.js \
	src/render/ast2scxml.js \
	src/render/ast2smcat.js \
	src/render/astMassage.js \
	src/render/counter.js \
	src/render/dot.states.template.js \
	src/render/dot.template.js \
	src/render/scxml.template.js \
	src/render/smcat.template.js \
	src/render/utl.js
