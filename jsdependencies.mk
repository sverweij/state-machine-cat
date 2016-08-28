
# DO NOT DELETE THIS LINE -- js-makedepend depends on it.

# amd dependencies
src/index.js: \
	src/parse/stategenny-parser.js \
	src/render/ast2dot.js \
	src/render/ast2stategenny.js

# cjs dependencies
src/cli/actions.js: \
	src/index.js

src/index.js: \
	src/parse/stategenny-parser.js \
	src/render/ast2dot.js \
	src/render/ast2stategenny.js

src/cli/index.js: \
	package.json \
	src/cli/actions.js \
	src/cli/normalizations.js \
	src/cli/validations.js

src/cli/validations.js: \
	src/index.js

