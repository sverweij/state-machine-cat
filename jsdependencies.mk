
# DO NOT DELETE THIS LINE -- js-makedepend depends on it.

# amd dependencies
src/index.js: \
	src/lib/viz.js/viz.js \
	src/parse/smcat-parser.js \
	src/render/ast2dot.js \
	src/render/ast2smcat.js

src/render/ast2dot.js: \
	src/lib/handlebars.runtime.js \
	src/render/astMassage.js \
	src/render/counter.js \
	src/render/dot.states.template.js \
	src/render/dot.template.js \
	src/render/utl.js

src/render/astMassage.js: \
	src/render/utl.js

src/render/dot.states.template.js: \
	src/lib/handlebars.runtime.js

src/render/dot.template.js: \
	src/lib/handlebars.runtime.js

src/render/ast2smcat.js: \
	src/lib/handlebars.runtime.js \
	src/render/smcat.template.js

src/render/smcat.template.js: \
	src/lib/handlebars.runtime.js

# cjs dependencies
src/cli/actions.js: \
	src/index.js

src/index.js: \
	src/lib/viz.js/viz.js \
	src/parse/smcat-parser.js \
	src/render/ast2dot.js \
	src/render/ast2smcat.js

src/render/ast2dot.js: \
	src/lib/handlebars.runtime.js \
	src/render/astMassage.js \
	src/render/counter.js \
	src/render/dot.states.template.js \
	src/render/dot.template.js \
	src/render/utl.js

src/render/astMassage.js: \
	src/render/utl.js

src/render/ast2smcat.js: \
	src/lib/handlebars.runtime.js \
	src/render/smcat.template.js

src/cli/index.js: \
	package.json \
	src/cli/actions.js \
	src/cli/normalizations.js \
	src/cli/validations.js

src/cli/validations.js: \
	src/index.js

# amd dependencies
# cjs dependencies
test/cli/actions.spec.js: \
	src/cli/actions.js

src/cli/actions.js: \
	src/index.js

src/index.js: \
	src/lib/viz.js/viz.js \
	src/parse/smcat-parser.js \
	src/render/ast2dot.js \
	src/render/ast2smcat.js

src/render/ast2dot.js: \
	src/lib/handlebars.runtime.js \
	src/render/astMassage.js \
	src/render/counter.js \
	src/render/dot.states.template.js \
	src/render/dot.template.js \
	src/render/utl.js

src/render/astMassage.js: \
	src/render/utl.js

src/render/ast2smcat.js: \
	src/lib/handlebars.runtime.js \
	src/render/smcat.template.js

test/cli/normalizations.spec.js: \
	src/cli/normalizations.js

test/cli/validations.spec.js: \
	src/cli/validations.js

src/cli/validations.js: \
	src/index.js

test/index.spec.js: \
	package.json \
	src/index.js

test/parse/smcat-parser.spec.js: \
	src/parse/smcat-parser.js \
	test/parse/00-no-transitions.json \
	test/parse/01-transitions-only.json \
	test/parse/02-comments.json \
	test/parse/03-composite.json \
	test/parse/10-no-transitions-errors.json \
	test/parse/11-transition-errors.json \
	test/parse/12-composition-errors.json

test/render/ast2dot.spec.js: \
	src/render/ast2dot.js

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

# amd dependencies
ONLINE_INTERPRETER_SOURCES=doc/smcat-online-interpreter.js \
	src/index.js \
	src/lib/handlebars.runtime.js \
	src/lib/viz.js/viz.js \
	src/parse/smcat-parser.js \
	src/render/ast2dot.js \
	src/render/ast2smcat.js \
	src/render/astMassage.js \
	src/render/counter.js \
	src/render/dot.states.template.js \
	src/render/dot.template.js \
	src/render/smcat.template.js \
	src/render/utl.js
