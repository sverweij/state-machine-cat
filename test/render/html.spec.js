const fs      = require('fs');
const path    = require('path');
const expect  = require('chai').expect;
const render  = require('../../src/render/html');

const testPairs = [{
    "title": "renders the kitchensink",
    "input": "../parse/fixtures/kitchensink.json",
    "expectedOutput": "../parse/fixtures/kitchensink.html"
}, {
    "title": "renders composite states",
    "input": "../parse/fixtures/composite.json",
    "expectedOutput": "../parse/fixtures/composite.html"
}, {
    "title": "renders transitions of composite states even when there's no 'root' transitions",
    "input": "../parse/fixtures/composite_no_root_transitions.json",
    "expectedOutput": "../parse/fixtures/composite_no_root_transitions.html"
}, {
    "title": "renders the empty state chart",
    "input": "../parse/fixtures/minimal.json",
    "expectedOutput": "../parse/fixtures/minimal.html"
}, {
    "title": "renders pseudo states",
    "input": "../parse/fixtures/states-with-a-label.json",
    "expectedOutput": "../parse/fixtures/states-with-a-label.html"
}];

describe('render html', () => {
    testPairs.forEach((pPair) => it(pPair.title, () => {
        expect(
            render(require(pPair.input))
        ).to.equal(
            fs.readFileSync(path.join(__dirname, pPair.expectedOutput), "utf-8")
        );
    }));
});

/* eslint import/no-dynamic-require: off */
