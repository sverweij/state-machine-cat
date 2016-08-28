
# DO NOT DELETE THIS LINE -- js-makedepend depends on it.

# amd dependencies
src/index.js: \
	src/parse/stategenny-parser.js

# cjs dependencies
src/index.js: \
	src/parse/stategenny-parser.js

src/parse/stategenny-parser.spec.js: \
	src/parse/spec/00-no-transitions.json \
	src/parse/spec/01-transitions-only.json \
	src/parse/spec/10-no-transitions-errors.json \
	src/parse/stategenny-parser.js

