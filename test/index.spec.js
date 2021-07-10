import { readFileSync } from "node:fs";
import chai from "chai";
import chaiXML from "chai-xml";
import smcat from "../src/index.js";
import smcat_node from "../src/index-node.js";

chai.use(chaiXML);
const expect = chai.expect;
const $package = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8")
);

describe("The index barrel - integration", () => {
  it("returned version corresponds with the package's", () => {
    expect(smcat.version).to.equal($package.version);
  });

  it("'echoes' the input when -I smcat -T smcat", () => {
    expect(
      smcat.render("a;\n", {
        inputType: "smcat",
        outputType: "smcat",
      })
    ).to.equal("a;\n\n");
  });

  it("returns svg and assumes smcat when no options passed", () => {
    expect(smcat.render("a;\n", null)).xml.to.be.valid();
  });

  it("returns svg when no outputType specified", () => {
    expect(
      smcat.render("a;\n", {
        inputType: "smcat",
      })
    ).xml.to.be.valid;
  });

  it("returns svg when svg specified as output", () => {
    expect(
      smcat.render("a;\n", {
        inputType: "smcat",
        outputType: "svg",
      })
    ).xml.to.be.valid();
  });

  it("returns svg rendered with another engine when that is specified ('neato' here)", () => {
    expect(
      smcat.render("a=>b;b=>c;c=>a;", {
        inputType: "smcat",
        outputType: "svg",
        engine: "neato",
      })
    ).xml.to.be.valid();
  });

  it("accepts json as input", () => {
    expect(
      smcat.render('{"states":[{"name":"a", "type":"regular"}]}', {
        inputType: "json",
        outputType: "smcat",
      })
    ).to.equal("a;\n\n");
  });

  it("throws when a passed JSON is not a valid AST", () => {
    expect(() => {
      smcat.render('{"states":[{"name":"a", "type":"non-existent-type"}]}', {
        inputType: "json",
        outputType: "smcat",
      });
    }).to.throw();
  });

  it("accepts javascript objects as input", () => {
    expect(
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
        }
      )
    ).to.equal("a;\n\n");
  });

  it("throws when a passed javascript object is not a valid AST", () => {
    expect(() => {
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
        }
      );
    }).to.throw();
  });

  it("returns the ast for outputType === json", () => {
    expect(
      smcat.render("a;", {
        inputType: "smcat",
        outputType: "json",
      })
    ).to.deep.equal({
      states: [
        {
          name: "a",
          type: "regular",
        },
      ],
    });
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
