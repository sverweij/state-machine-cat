const expect  = require('chai').expect;
const convert = require('../../src/render/ast2stategenny');
const parser  = require('../../src/parse/stategenny-parser');

describe("#render - ast2stategenny", () => {
    describe("1:1 tests", () => {
        it("on comments-wherever.json", () => {
            let lAST = require("../parse/fixtures/comments-wherever.json");
            let lProgram = convert.render(lAST);
            expect(parser.parse(lProgram)).to.deep.equal(lAST);
        });
    });
});
