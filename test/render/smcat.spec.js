const expect  = require('chai').expect;
const convert = require('../../src/render/smcat');
const parser  = require('../../src/parse/smcat-parser');

const programASTPairs =
        require("../parse/00-no-transitions.json")
            .concat(require("../parse/01-transitions-only.json"))
            .concat(require("../parse/03-composite.json"));
// .concat(require("../parse/04-labels.json"))

describe('#parse(convert) - happy day ASTs - ', () => {
    programASTPairs.forEach((pPair) => {
        if (pPair.hasOwnProperty('pending') && pPair.pending) {
            /* eslint mocha/no-skipped-tests: off */
            xit(pPair.title);
        } else {
            it(pPair.title, () => {
                expect(
                    parser.parse(convert(pPair.ast))
                ).to.deep.equal(
                    pPair.ast
                );
            });
        }
    });
});
