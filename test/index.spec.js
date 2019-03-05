const chai   = require('chai');

const expect = chai.expect;
const smcat  = require('../src');

chai.use(require('chai-xml'));

describe("The index barrel", () => {
    it("returned version corresponds with the package's", () => {
        expect(smcat.version).to.equal(require("../package.json").version);
    });

    it("'echoes' the input when -I smcat -T smcat", (done) => {
        smcat.render(
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

    it("returns svg and assumes smcat when no options passed", (done) => {
        smcat.render(
            "a;\n",
            null,
            (nok, ok) => {
                expect(nok).to.be.null;
                expect(ok).xml.to.be.valid();
                done();
            }
        );
    });

    it("returns svg when no outputType specified", (done) => {
        smcat.render(
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

    it("returns svg when svg specified as output", (done) => {
        smcat.render(
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

    it("returns svg rendered with another engine when that is specified ('neato' here)", (done) => {
        smcat.render(
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

    it("accepts json as input", (done) => {
        smcat.render(
            '{"states":[{"name":"a", "type":"regular"}]}',
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

    it("throws when a passed JSON is not a valid AST", (done) => {
        smcat.render(
            '{"states":[{"name":"a", "type":"regular"}]}',
            {
                inputType: "json",
                outputType: "smcat"
            },
            (nok, ok) => {
                expect(nok).to.be.not.null;
                expect(ok).to.be.undefined;
                done();
            }
        );
    });

    it("accepts javascript objects as input", (done) => {
        smcat.render(
            {
                states: [{
                    name: "a",
                    type: "regular"
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

    it("throws when a passed javascript object is not a valid AST", (done) => {
        smcat.render(
            {
                states: [{
                    name: "a",
                    type: "not a valid StateType"
                }]
            },
            {
                inputType: "json",
                outputType: "smcat"
            },
            (nok, ok) => {
                expect(nok).to.be.not.null;
                expect(ok).to.be.undefined;
                done();
            }
        );
    });

    it("returns an html table the input when -I smcat -T html", (done) => {
        smcat.render(
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

    it("returns the ast for outputType === json", (done) => {
        smcat.render(
            "a;",
            {
                inputType: "smcat",
                outputType: "json"
            },
            (nok, ok) => {
                expect(nok).to.be.null;
                expect(ok).to.deep.equal({
                    states: [{
                        name: "a",
                        type: "regular"
                    }]
                });
                done();
            }
        );
    });

});
/* eslint no-unused-expressions: 0 */
