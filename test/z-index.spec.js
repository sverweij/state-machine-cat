const chai = require("chai");
const chaiXML = require("chai-xml");

let gSmcat = {};

chai.use(chaiXML);
const expect = chai.expect;
const $package = require("../package.json");

describe("integration - commonjs", () => {
  before("load the cat later on only", () => {
    // In case you're wondering whether it's you. No. What is happening here
    // is non obvious...
    // - we already ran all other automated tests (z-index.spec.js is run
    //   as last because alphabet). This is deliberate.
    // - some globals already exist, but from the esm context. One symbol
    //   in particluar (viz_import) has a slightly different signature between
    //   esm and cjs contexts (resulting in 'viz_import.defaults is not a function').
    //   Thorougly scrubbing the module cache prevents that. Along with probably
    //   some other potential problems with modules that have side effects.
    //   We do this _before_ loading the smcat module, because otherwise the
    //   error still happens.
    Object.keys(require.cache).forEach((pKey) => {
      Reflect.deleteProperty(require.cache, require.resolve(pKey));
    });

    // - loading smcat lazily ensures it's loaded _after_ the esm unit tests
    //   have been run. If we don't do this the code coverage collector counts
    //   some paths from the dist/commonjs path (in src/render/smcat/index.js),
    //   instead of the src one, and that results in a false positive on
    //   code coverage
    gSmcat = require("../dist/commonjs/index.js");
  });

  it("returned version corresponds with the package's", () => {
    expect(gSmcat.version).to.equal($package.version);
  });

  it("'echoes' the input when -I smcat -T smcat", () => {
    expect(
      gSmcat.render("a;\n", {
        inputType: "smcat",
        outputType: "smcat",
      })
    ).to.equal("a;\n\n");
  });

  it("returns svg and assumes gSmcat when no options passed", () => {
    expect(gSmcat.render("a;\n", null)).xml.to.be.valid();
  });

  it("returns svg when no outputType specified", () => {
    expect(
      gSmcat.render("a;\n", {
        inputType: "smcat",
      })
    ).xml.to.be.valid();
  });

  it("returns svg when svg specified as output", () => {
    expect(
      gSmcat.render("a;\n", {
        inputType: "smcat",
        outputType: "svg",
      })
    ).xml.to.be.valid();
  });

  it("returns svg rendered with another engine when that is specified ('neato' here)", () => {
    expect(
      gSmcat.render("a=>b;b=>c;c=>a;", {
        inputType: "smcat",
        outputType: "svg",
        engine: "neato",
      })
    ).xml.to.be.valid();
  });

  it("accepts json as input", () => {
    expect(
      gSmcat.render('{"states":[{"name":"a", "type":"regular"}]}', {
        inputType: "json",
        outputType: "smcat",
      })
    ).to.equal("a;\n\n");
  });

  it("throws when a passed JSON is not a valid AST", () => {
    expect(() => {
      gSmcat.render('{"states":[{"name":"a", "type":"non-existent-type"}]}', {
        inputType: "json",
        outputType: "smcat",
      });
    }).to.throw();
  });

  it("accepts javascript objects as input", () => {
    expect(
      gSmcat.render(
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
      gSmcat.render(
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
      gSmcat.render("a;", {
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
      gSmcat.render(lSCXML, {
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
      gSmcat.render("a, ], b, c; a => ]; ] => b; ] => c;", {
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
