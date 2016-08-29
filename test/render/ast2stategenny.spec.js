const expect  = require('chai').expect;
const convert = require('../../src/render/ast2stategenny');
const parser  = require('../../src/parse/stategenny-parser');

const programASTPairs =
        require("../parse/00-no-transitions.json")
        .concat(require("../parse/01-transitions-only.json"));

describe('#parse(convert) - happy day ASTs - ', () => {
    programASTPairs.forEach(pPair => {
        it(pPair.title, () => {
            expect(
                parser.parse(convert.render(pPair.ast))
            ).to.deep.equal(
                pPair.ast
            );
        });
    });
});
