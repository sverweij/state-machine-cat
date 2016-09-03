const fs      = require('fs');
const path    = require('path');
const expect  = require('chai').expect;
const convert = require('../../src/render/ast2dot').render;

describe('#ast2dot', () => {
    it("renders the kitchensink", () => {
        expect(
            convert(require("../parse/fixtures/kitchensink.json"))
        ).to.equal(
            fs.readFileSync(path.join(__dirname, "../parse/fixtures/kitchensink.dot"), "utf-8")
        );
    });
    it("renders the kitchensink", () => {
        expect(
            convert(require("../parse/fixtures/minimal.json"))
        ).to.equal(
            fs.readFileSync(path.join(__dirname, "../parse/fixtures/minimal.dot"), "utf-8")
        );
    });
});
