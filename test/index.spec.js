const chai     = require('chai');
const expect   = chai.expect;
const stategen = require('../src');

chai.use(require('chai-xml'));

describe("The index barrel", () => {
    it("returned version corresponds with the package's", () => {
        expect(stategen.version).to.equal(require("../package.json").version);
    });

    it("'echos' the input when -I stategenny -T stategenny", done => {
        stategen.render(
            "a;\n",
            {
                inputType: "stategenny",
                outputType: "stategenny"
            },
            (nok, ok) => {
                expect(nok).to.be.null;
                expect(ok).to.equal("a;\n");
                done();
            }
        );
    });

    it("returns svg and assumes stategenny when no options passed", done => {
        stategen.render(
            "a;\n",
            null,
            (nok, ok) => {
                expect(nok).to.be.null;
                expect(ok).xml.to.be.valid();
                done();
            }
        );
    });

    it("returns svg when no outputType specified", done => {
        stategen.render(
            "a;\n",
            {
                inputType: "stategenny"
            },
            (nok, ok) => {
                expect(nok).to.be.null;
                expect(ok).xml.to.be.valid();
                done();
            }
        );
    });

    it("returns svg when svg specified as output", done => {
        stategen.render(
            "a;\n",
            {
                inputType: "stategenny",
                outputType: "svg"
            },
            (nok, ok) => {
                expect(nok).to.be.null;
                expect(ok).xml.to.be.valid();
                done();
            }
        );
    });
});
/* eslint no-unused-expressions: 0 */
