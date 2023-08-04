import { deepStrictEqual, strictEqual, throws } from "node:assert";
import fastxml from "fast-xml-parser";
import smcat from "../src/index.mjs";
import smcat_node from "../src/index-node.mjs";
import options from "../src/options.mjs";
import { createRequireJSON } from "./utl.mjs";

const $package = createRequireJSON(import.meta.url)("../package.json");
const gXMLParser = new fastxml.XMLParser();

describe("integration - regular esm", () => {
  it("returned version corresponds with the package's", () => {
    strictEqual(smcat.version, $package.version);
  });

  it("'echoes' the input when -I smcat -T smcat", () => {
    strictEqual(
      smcat.render("a;\n", {
        inputType: "smcat",
        outputType: "smcat",
      }),
      "a;\n\n",
    );
  });

  it("returns svg and assumes smcat when no options passed", () => {
    const lXML = smcat.render("a;\n", null);
    gXMLParser.parse(lXML, true);
  });

  it("returns svg when no outputType specified", () => {
    gXMLParser.parse(
      smcat.render("a;\n", {
        inputType: "smcat",
      }),
      true,
    );
  });

  it("returns svg when svg specified as output", () => {
    gXMLParser.parse(
      smcat.render("a;\n", {
        inputType: "smcat",
        outputType: "svg",
      }),
      true,
    );
  });

  it("returns svg rendered with another engine when that is specified ('neato' here)", () => {
    gXMLParser.parse(
      smcat.render("a=>b;b=>c;c=>a;", {
        inputType: "smcat",
        outputType: "svg",
        engine: "neato",
      }),
      true,
    );
  });

  it("accepts json as input", () => {
    strictEqual(
      smcat.render('{"states":[{"name":"a", "type":"regular"}]}', {
        inputType: "json",
        outputType: "smcat",
      }),
      "a;\n\n",
    );
  });

  it("throws when a passed JSON is not a valid AST", () => {
    throws(() => {
      smcat.render('{"states":[{"name":"a", "type":"non-existent-type"}]}', {
        inputType: "json",
        outputType: "smcat",
      });
    });
  });

  it("accepts javascript objects as input", () => {
    strictEqual(
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
      ),
      "a;\n\n",
    );
  });

  it("throws when a passed javascript object is not a valid AST", () => {
    throws(() => {
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
      );
    });
  });

  it("returns the ast for outputType === json", () => {
    deepStrictEqual(
      smcat.render("a;", {
        inputType: "smcat",
        outputType: "json",
      }),
      {
        states: [
          {
            name: "a",
            type: "regular",
          },
        ],
      },
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

    deepStrictEqual(
      smcat.render(lSCXML, {
        inputType: "scxml",
        outputType: "json",
      }),
      {
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
      },
    );
  });

  it("desugars when asked to", () => {
    strictEqual(
      smcat.render("a, ], b, c; a => ]; ] => b; ] => c;", {
        outputType: "smcat",
        desugar: true,
      }),
      `a,
b,
c;

a => b;
a => c;
`,
    );
  });
  it("desugars when asked to (node)", () => {
    strictEqual(
      smcat_node.render("a, ], b, c; a => ]; ] => b; ] => c;", {
        outputType: "smcat",
        desugar: true,
      }),
      `a,
b,
c;

a => b;
a => c;
`,
    );
  });

  it("returns an object with allowed values", () => {
    deepStrictEqual(smcat.getAllowedValues(), options.getAllowedValues());
  });
});
/* eslint no-unused-expressions: 0 */
