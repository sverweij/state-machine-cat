const chai     = require('chai');
const expect   = chai.expect;
const stategen = require('../src');

chai.use(require('chai-xml'));

describe("The index barrel", () => {
    it("returned version corresponds with the package's", () => {
        expect(stategen.version).to.equal(require("../package.json").version);
    });

    it("'echos' the input when -I smcat -T smcat", done => {
        stategen.render(
            "a;\n",
            {
                inputType: "smcat",
                outputType: "smcat"
            },
            (nok, ok) => {
                expect(nok).to.be.null;
                expect(ok).to.equal("a;\n\n");
                done();
            }
        );
    });

    it("returns svg and assumes smcat when no options passed", done => {
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
                inputType: "smcat"
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
                inputType: "smcat",
                outputType: "svg"
            },
            (nok, ok) => {
                expect(nok).to.be.null;
                expect(ok).xml.to.be.valid();
                done();
            }
        );
    });

    it("returns svg rendered with another engine when that is specified ('neato' here)", done => {
        stategen.render(
            "a=>b;b=>c;c=>a;",
            {
                inputType: "smcat",
                outputType: "svg",
                engine: "neato"
            },
            (nok, ok) => {
                expect(nok).to.be.null;
                expect(ok).xml.to.be.valid();
                done();
            }
        );
    });

    it("accepts json as input", done => {
        stategen.render(
            '{"states":[{"name":"a"}]}',
            {
                inputType: "json",
                outputType: "smcat"
            },
            (nok, ok) => {
                expect(nok).to.be.null;
                expect(ok).to.equal("a;\n\n");
                done();
            }
        );
    });

    it("accepts javascript objects as input", done => {
        stategen.render(
            {
                states: [{
                    name: "a"
                }]
            },
            {
                inputType: "json",
                outputType: "smcat"
            },
            (nok, ok) => {
                expect(nok).to.be.null;
                expect(ok).to.equal("a;\n\n");
                done();
            }
        );
    });

    it("returns an html table the input when -I smcat -T html", done => {
        stategen.render(
            "a;",
            {
                inputType: "smcat",
                outputType: "html"
            },
            (nok, ok) => {
                expect(nok).to.be.null;
                expect(ok).to.contain("<table>");
                done();
            }
        );
    });
});
/* eslint no-unused-expressions: 0 */
