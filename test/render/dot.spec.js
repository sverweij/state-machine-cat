const fs      = require('fs');
const path    = require('path');
const expect  = require('chai').expect;
const convert = require('../../src/render/dot');

const testPairs = [{
    "title": "renders the kitchensink",
    "input": "../parse/fixtures/kitchensink.json",
    "expectedOutput": "../parse/fixtures/kitchensink.dot"
}, {
    "title": "renders composite states",
    "input": "../parse/fixtures/composite.json",
    "expectedOutput": "../parse/fixtures/composite.dot"
}, {
    "title": "renders composite states - left-right",
    "input": "../parse/fixtures/composite.json",
    "options": {direction: "left-right"},
    "expectedOutput": "../parse/fixtures/composite-left-right.dot"
}, {
    "title": "renders composite states - left-right",
    "input": "../parse/fixtures/composite.json",
    "options": {direction: "right-left"},
    "expectedOutput": "../parse/fixtures/composite-right-left.dot"
}, {
    "title": "renders composite states - left-right",
    "input": "../parse/fixtures/composite.json",
    "options": {direction: "bottom-top"},
    "expectedOutput": "../parse/fixtures/composite-bottom-top.dot"
}, {
    "title": "renders transitions of composite states even when there's no 'root' transitions",
    "input": "../parse/fixtures/composite_no_root_transitions.json",
    "expectedOutput": "../parse/fixtures/composite_no_root_transitions.dot"
}, {
    "title": "renders the empty state chart",
    "input": "../parse/fixtures/minimal.json",
    "expectedOutput": "../parse/fixtures/minimal.dot"
}, {
    "title": "renders pseudo states",
    "input": "../parse/fixtures/pseudostates.json",
    "expectedOutput": "../parse/fixtures/pseudostates.dot"
}, {
    "title": "renders pseudo states",
    "input": "../parse/fixtures/pseudostates.json",
    "options": {direction: "top-down"},
    "expectedOutput": "../parse/fixtures/pseudostates.dot"
}, {
    "title": "renders pseudo states",
    "input": "../parse/fixtures/pseudostates.json",
    "options": {direction: "bottom-top"},
    "expectedOutput": "../parse/fixtures/pseudostates-bottom-top.dot"
}, {
    "title": "renders pseudo states",
    "input": "../parse/fixtures/pseudostates.json",
    "options": {direction: "left-right"},
    "expectedOutput": "../parse/fixtures/pseudostates-left-right.dot"
}, {
    "title": "renders pseudo states",
    "input": "../parse/fixtures/pseudostates.json",
    "options": {direction: "right-left"},
    "expectedOutput": "../parse/fixtures/pseudostates-right-left.dot"
}, {
    "title": "renders pseudo states",
    "input": "../parse/fixtures/states-with-a-label.json",
    "expectedOutput": "../parse/fixtures/states-with-a-label.dot"
}];

describe('render dot', () => {
    testPairs.forEach((pPair) => it(pPair.title, () => {
        expect(
            convert(require(pPair.input), pPair.options)
        ).to.equal(
            fs.readFileSync(path.join(__dirname, pPair.expectedOutput), "utf-8")
        );
    }));
});

/* eslint import/no-dynamic-require: off */
