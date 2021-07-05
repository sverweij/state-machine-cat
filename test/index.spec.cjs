const chai = require("chai");

const expect = chai.expect;
const smcat = require("../src/index.cjs");
const smcat_node = require("../src/index-node.cjs");

chai.use(require("chai-xml"));

describe("The index barrel - integration", () => {
  it("returned version corresponds with the package's", () => {
    expect(smcat.version).to.equal(require("../package.json").version);
  });

  it("'echoes' the input when -I smcat -T smcat", (pDone) => {
    smcat.render(
      "a;\n",
      {
        inputType: "smcat",
        outputType: "smcat",
      },
      (pNok, pOk) => {
        expect(pNok).to.be.null;
        expect(pOk).to.equal("a;\n\n");
        pDone();
      }
    );
  });

  it("returns svg and assumes smcat when no options passed", (pDone) => {
    smcat.render("a;\n", null, (pNok, pOk) => {
      expect(pNok).to.be.null;
      expect(pOk).xml.to.be.valid();
      pDone();
    });
  });

  it("returns svg when no outputType specified", (pDone) => {
    smcat.render(
      "a;\n",
      {
        inputType: "smcat",
      },
      (pNok, pOk) => {
        expect(pNok).to.be.null;
        expect(pOk).xml.to.be.valid();
        pDone();
      }
    );
  });

  it("returns svg when svg specified as output", (pDone) => {
    smcat.render(
      "a;\n",
      {
        inputType: "smcat",
        outputType: "svg",
      },
      (pNok, pOk) => {
        expect(pNok).to.be.null;
        expect(pOk).xml.to.be.valid();
        pDone();
      }
    );
  });

  it("returns svg rendered with another engine when that is specified ('neato' here)", (pDone) => {
    smcat.render(
      "a=>b;b=>c;c=>a;",
      {
        inputType: "smcat",
        outputType: "svg",
        engine: "neato",
      },
      (pNok, pOk) => {
        expect(pNok).to.be.null;
        expect(pOk).xml.to.be.valid();
        pDone();
      }
    );
  });

  it("accepts json as input", (pDone) => {
    smcat.render(
      '{"states":[{"name":"a", "type":"regular"}]}',
      {
        inputType: "json",
        outputType: "smcat",
      },
      (pNok, pOk) => {
        expect(pNok).to.be.null;
        expect(pOk).to.equal("a;\n\n");
        pDone();
      }
    );
  });

  it("throws when a passed JSON is not a valid AST", (pDone) => {
    smcat.render(
      '{"states":[{"name":"a", "type":"regular"}]}',
      {
        inputType: "json",
        outputType: "smcat",
      },
      (pNok, pOk) => {
        expect(pNok).to.be.not.null;
        expect(pOk).to.be.undefined;
        pDone();
      }
    );
  });

  it("accepts javascript objects as input", (pDone) => {
    smcat.render(
      {
        states: [
          {
            name: "a",
            type: "regular",
          },
        ],
      },
      {
        inputType: "json",
        outputType: "smcat",
      },
      (pNok, pOk) => {
        expect(pNok).to.be.null;
        expect(pOk).to.equal("a;\n\n");
        pDone();
      }
    );
  });

  it("throws when a passed javascript object is not a valid AST", (pDone) => {
    smcat.render(
      {
        states: [
          {
            name: "a",
            type: "not a valid StateType",
          },
        ],
      },
      {
        inputType: "json",
        outputType: "smcat",
      },
      (pNok, pOk) => {
        expect(pNok).to.be.not.null;
        expect(pOk).to.be.undefined;
        pDone();
      }
    );
  });

  it("returns the ast for outputType === json", (pDone) => {
    smcat.render(
      "a;",
      {
        inputType: "smcat",
        outputType: "json",
      },
      (pNok, pOk) => {
        expect(pNok).to.be.null;
        expect(pOk).to.deep.equal({
          states: [
            {
              name: "a",
              type: "regular",
            },
          ],
        });
        pDone();
      }
    );
  });

  it("returns the ast for inputTYpe === scxml, outputType === json", () => {
    const lSCXML = `<?xml version="1.0" encoding="UTF-8"?>
        <scxml xmlns="http://www.w3.org/2005/07/scxml" version="1.0">
            <state id="off">
                <transition event="switch_flipped" target="on"/>
            </state>
            <state id="on">
                <transition event="switch_flipped" target="off"/>
            </state>
        </scxml>`;

    expect(
      smcat.render(lSCXML, {
        inputType: "scxml",
        outputType: "json",
      })
    ).to.deep.equal({
      states: [
        {
          name: "off",
          type: "regular",
        },
        {
          name: "on",
          type: "regular",
        },
      ],
      transitions: [
        {
          from: "off",
          to: "on",
          event: "switch_flipped",
          label: "switch_flipped",
        },
        {
          from: "on",
          to: "off",
          event: "switch_flipped",
          label: "switch_flipped",
        },
      ],
    });
  });

  it("desugars when asked to", () => {
    expect(
      smcat.render("a, ], b, c; a => ]; ] => b; ] => c;", {
        outputType: "smcat",
        desugar: true,
      })
    ).to.equal(`a,
b,
c;

a => b;
a => c;
`);
  });
  it("desugars when asked to (node)", () => {
    expect(
      smcat_node.render("a, ], b, c; a => ]; ] => b; ] => c;", {
        outputType: "smcat",
        desugar: true,
      })
    ).to.equal(`a,
b,
c;

a => b;
a => c;
`);
  });
});
/* eslint no-unused-expressions: 0 */
