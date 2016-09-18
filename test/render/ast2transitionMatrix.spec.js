const expect  = require('chai').expect;
const massage = require('../../src/render/ast2transitionMatrix');

describe('#ast2transitionCountMatrix', () => {
    require("./ast2transitionCountMatrix.json")
        .forEach(pPair => it(pPair.title, () => {
            expect(
                massage.renderCounts(pPair.input)
            ).to.deep.equal(
                pPair.expectedOutput
            );
        }));
});

describe('#ast2transitionLabelMatrix', () => {
    require("./ast2transitionLabelMatrix.json")
        .forEach(pPair => it(pPair.title, () => {
            expect(
                massage.renderLabels(pPair.input)
            ).to.deep.equal(
                pPair.expectedOutput
            );
        }));
});
