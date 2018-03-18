const expect  = require('chai').expect;
const massage = require('../../src/render/html/ast2Matrix');

describe('#ast2Matrix - adjecency', () => {
    require("./ast2AdjecencyMatrix.json")
        .forEach((pPair) => it(pPair.title, () => {
            expect(
                massage.toAdjecencyMatrix(pPair.input)
            ).to.deep.equal(
                pPair.expectedOutput
            );
        }));
});

describe('#ast2Matrix - incidence', () => {
    require("./ast2IncidenceMatrix.json")
        .forEach((pPair) => it(pPair.title, () => {
            expect(
                massage.toIncidenceMatrix(pPair.input)
            ).to.deep.equal(
                pPair.expectedOutput
            );
        }));
});

describe('#ast2Matrix - labels', () => {
    require("./ast2transitionLabelMatrix.json")
        .forEach((pPair) => it(pPair.title, () => {
            expect(
                massage.renderLabels(pPair.input)
            ).to.deep.equal(
                pPair.expectedOutput
            );
        }));
});
