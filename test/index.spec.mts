import { deepEqual, equal, rejects, throws } from "node:assert/strict";
import { XMLParser } from "fast-xml-parser";
import { createRequireJSON } from "./utl.mjs";
import { version, render } from "#index.mjs";
import {
  render as smCatnodejsRender,
  getAllowedValues as smCatnodejsGetAllowedValues,
} from "#index-node.mjs";
import { getAllowedValues } from "#options.mjs";

const $package = createRequireJSON(import.meta.url)("../package.json");
const gXMLParser = new XMLParser();

describe("integration - regular esm", () => {
  it("returned version corresponds with the package's", () => {
    equal(version, $package.version);
  });

  it("'echoes' the input when -I smcat -T smcat", async () => {
    equal(
      await render("a;\n", {
        inputType: "smcat",
        outputType: "smcat",
      }),
      "a;\n\n",
    );
  });

  it("returns svg and assumes smcat when no options passed", async () => {
    const lXML = await render("a;\n", null);
    gXMLParser.parse(lXML, true);
  });

  it("returns svg when no outputType specified", async () => {
    gXMLParser.parse(
      await render("a;\n", {
        inputType: "smcat",
      }),
      true,
    );
  });

  it("returns svg when svg specified as output", async () => {
    gXMLParser.parse(
      await render("a;\n", {
        inputType: "smcat",
        outputType: "svg",
      }),
      true,
    );
  });

  it("returns svg rendered with another engine when that is specified ('neato' here)", async () => {
    gXMLParser.parse(
      await render("a=>b;b=>c;c=>a;", {
        inputType: "smcat",
        outputType: "svg",
        engine: "neato",
      }),
      true,
    );
  });

  it("accepts json as input", async () => {
    equal(
      await render('{"states":[{"name":"a", "type":"regular"}]}', {
        inputType: "json",
        outputType: "smcat",
      }),
      "a;\n\n",
    );
  });

  it("throws when a passed JSON is not a valid AST", async () => {
    await rejects(async () => {
      await render('{"states":[{"name":"a", "type":"non-existent-type"}]}', {
        inputType: "json",
        outputType: "smcat",
      });
    });
  });

  it("accepts javascript objects as input", async () => {
    equal(
      await render(
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

  it("throws when a passed javascript object is not a valid AST", async () => {
    await rejects(async () => {
      await render(
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

  it("returns the ast for outputType === json", async () => {
    deepEqual(
      await render("a;", {
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

  it("returns the ast for inputTYpe === scxml, outputType === json", async () => {
    const lSCXML = `<?xml version="1.0" encoding="UTF-8"?>
        <scxml xmlns="http://www.w3.org/2005/07/scxml" version="1.0">
            <state id="off">
                <transition event="switch_flipped" target="on"/>
            </state>
            <state id="on">
                <transition event="switch_flipped" target="off"/>
            </state>
        </scxml>`;

    deepEqual(
      await render(lSCXML, {
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
            id: 1,
            from: "off",
            to: "on",
            event: "switch_flipped",
            label: "switch_flipped",
          },
          {
            id: 2,
            from: "on",
            to: "off",
            event: "switch_flipped",
            label: "switch_flipped",
          },
        ],
      },
    );
  });

  it("desugars when asked to", async () => {
    equal(
      await render("a, ], b, c; a => ]; ] => b; ] => c;", {
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
  it("desugars when asked to (node)", async () => {
    equal(
      await smCatnodejsRender("a, ], b, c; a => ]; ] => b; ] => c;", {
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
    deepEqual(smCatnodejsGetAllowedValues(), getAllowedValues());
  });
});
/* eslint no-unused-expressions: 0 */
