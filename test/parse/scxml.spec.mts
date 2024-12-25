import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
import { deepEqual, doesNotThrow, equal, throws } from "node:assert/strict";
import Ajv from "ajv";

import { parse } from "#parse/scxml/index.mjs";
import $schema from "#parse/smcat-ast.schema.mjs";

const ajv = new Ajv();

const FIXTURE_DIR = fileURLToPath(
  new URL("../render/fixtures", import.meta.url),
);
const FIXTURE_INPUTS = fs
  .readdirSync(FIXTURE_DIR)
  .filter((pFileName) => pFileName.endsWith(".scxml"))
  .map((pFileName) => path.join(FIXTURE_DIR, pFileName));

describe("parse/scxml", () => {
  FIXTURE_INPUTS.forEach((pInputFixture) => {
    it(`correctly converts ${path.basename(pInputFixture)} to json`, () => {
      const lAST = parse(fs.readFileSync(pInputFixture, "utf8"));

      deepEqual(
        lAST,
        JSON.parse(
          fs.readFileSync(
            pInputFixture.replace(/\.scxml$/g, ".scxml.re-json"),
            "utf8",
          ),
        ),
      );
      equal(ajv.validate($schema, lAST), true);
    });
  });

  it("Interprets an 'invoke' in a state as an activity", () => {
    const lStateWithAnInvoke = `<?xml version="1.0" encoding="UTF-8"?>
      <scxml xmlns="http://www.w3.org/2005/07/scxml" version="1.0">
          <state id="doing">
              <invoke id="doSomething()"/>
          </state>
      </scxml>`;
    const lAST = parse(lStateWithAnInvoke);

    equal(ajv.validate($schema, lAST), true);
    deepEqual(lAST, {
      states: [
        {
          name: "doing",
          type: "regular",
          actions: [
            {
              type: "activity",
              body: "doSomething()",
            },
          ],
        },
      ],
    });
  });

  it("Interprets 'invokes' in a state as activities", () => {
    const lStateWithAnInvoke = `<?xml version="1.0" encoding="UTF-8"?>
      <scxml xmlns="http://www.w3.org/2005/07/scxml" version="1.0">
          <state id="doing">
              <invoke id="doSomething()"/>
              <invoke id="doSomethingElse()"/>
              <invoke>does an invoke with a body make sense?</invoke>
              <invoke/> <!-- likewise, does an empty invoke make sense? -->
          </state>
      </scxml>`;
    const lAST = parse(lStateWithAnInvoke);

    equal(ajv.validate($schema, lAST), true);
    deepEqual(lAST, {
      states: [
        {
          name: "doing",
          type: "regular",
          actions: [
            {
              type: "activity",
              body: "doSomething()",
            },
            {
              type: "activity",
              body: "doSomethingElse()",
            },
            {
              type: "activity",
              body: "does an invoke with a body make sense?",
            },
            {
              type: "activity",
              body: "",
            },
          ],
        },
      ],
    });
  });

  it("Makes 'target-less transitions' transitions to self", () => {
    const lScxmlWithTargetlessTransition = `<?xml version="1.0" encoding="UTF-8"?>
            <scxml xmlns="http://www.w3.org/2005/07/scxml" version="1.0">
                <state id="a">
                    <transition>
                        do something interesting
                    </transition>
                </state>
            </scxml>`;
    const lAST = parse(lScxmlWithTargetlessTransition);

    equal(ajv.validate($schema, lAST), true);
    deepEqual(lAST, {
      states: [
        {
          name: "a",
          type: "regular",
        },
      ],
      transitions: [
        {
          id: 1,
          from: "a",
          to: "a",
          action: "do something interesting",
          label: "/ do something interesting",
        },
      ],
    });
  });

  it("Processes an <initial> with a <transition> into an initial state", () => {
    const lScxmlWithInitialNode = `<?xml version="1.0"?>
        <scxml xmlns="http://www.w3.org/2005/07/scxml" version="1.0"> 
            <initial>
                <transition target="closed"/>
            </initial>
            <state id="closed"/>
        </scxml>`;
    const lAST = parse(lScxmlWithInitialNode);

    equal(ajv.validate($schema, lAST), true);
    deepEqual(lAST, {
      states: [
        {
          name: "initial",
          type: "initial",
        },
        {
          name: "closed",
          type: "regular",
        },
      ],
      transitions: [
        {
          id: 1,
          from: "initial",
          to: "closed",
        },
      ],
    });
  });

  it("Prefix an initial state within a state with that state's id", () => {
    const lScxmlWithInitialNode = `<?xml version="1.0"?>
        <scxml xmlns="http://www.w3.org/2005/07/scxml" version="1.0"> 
            <state id="door">
              <initial>
                <transition target="closed"/>
              </initial>
              <state id="closed"/>
            </state>
        </scxml>`;
    const lAST = parse(lScxmlWithInitialNode);

    equal(ajv.validate($schema, lAST), true);
    deepEqual(lAST, {
      states: [
        {
          name: "door",
          type: "regular",
          statemachine: {
            states: [
              {
                name: "door.initial",
                type: "initial",
              },
              {
                name: "closed",
                type: "regular",
              },
            ],
            transitions: [
              {
                id: 1,
                from: "door.initial",
                to: "closed",
              },
            ],
          },
        },
      ],
    });
  });

  it("leaves xml within onentry alone", () => {
    const lScxmlOnentryWithXml = `<?xml version="1.0" encoding="UTF-8"?>
        <scxml xmlns="http://www.w3.org/2005/07/scxml" xmlns:conf="http://www.w3.org/2005/scxml-conformance" 
               initial="a" version="1.0">
          <state id="a">
            <onentry>
              <assign location="Var1" expr="return"/>
            </onentry>
          </state>
        </scxml>
        `;
    const lAST = parse(lScxmlOnentryWithXml);

    equal(ajv.validate($schema, lAST), true);
    deepEqual(lAST, {
      states: [
        {
          name: "initial",
          type: "initial",
        },
        {
          name: "a",
          type: "regular",
          actions: [
            {
              type: "entry",
              body: '<assign location="Var1" expr="return"/>',
            },
          ],
        },
      ],
      transitions: [
        {
          id: 1,
          from: "initial",
          to: "a",
        },
      ],
    });
  });

  it("leaves xml within onexit alone", () => {
    const lScxmlOnexitWithXml = `<?xml version="1.0" encoding="UTF-8"?>
        <scxml xmlns="http://www.w3.org/2005/07/scxml" xmlns:conf="http://www.w3.org/2005/scxml-conformance" 
               initial="a" version="1.0">
          <state id="a">
            <onexit>
              <assign location="Var1" expr="return"/>
            </onexit>
          </state>
        </scxml>
        `;
    const lAST = parse(lScxmlOnexitWithXml);

    equal(ajv.validate($schema, lAST), true);
    deepEqual(lAST, {
      states: [
        {
          name: "initial",
          type: "initial",
        },
        {
          name: "a",
          type: "regular",
          actions: [
            {
              type: "exit",
              body: '<assign location="Var1" expr="return"/>',
            },
          ],
        },
      ],
      transitions: [
        {
          id: 1,
          from: "initial",
          to: "a",
        },
      ],
    });
  });

  it("leaves xml within transitions alone", () => {
    const lScxmlTransitionWithXml = `<?xml version="1.0" encoding="UTF-8"?>
        <scxml xmlns="http://www.w3.org/2005/07/scxml" xmlns:conf="http://www.w3.org/2005/scxml-conformance" 
               initial="a" version="1.0">
          <state id="a">
            <transition target="a">
              <assign location="Var1" expr="return"/>
            </transition>
          </state>
        </scxml>
        `;
    const lAST = parse(lScxmlTransitionWithXml);

    equal(ajv.validate($schema, lAST), true);
    deepEqual(lAST, {
      states: [
        {
          name: "initial",
          type: "initial",
        },
        {
          name: "a",
          type: "regular",
        },
      ],
      transitions: [
        {
          id: 1,
          from: "initial",
          to: "a",
        },
        {
          id: 2,
          from: "a",
          to: "a",
          action: '<assign location="Var1" expr="return"/>',
          label: '/ <assign location="Var1" expr="return"/>',
        },
      ],
    });
  });

  it("splits transtions with multiple space delimited targets into multiple transitions", () => {
    const lScxmTransitionToMultipleTargets = `<?xml version="1.0" encoding="UTF-8"?>
        <scxml
            xmlns="http://www.w3.org/2005/07/scxml"
            xmlns:conf="http://www.w3.org/2005/scxml-conformance" 
                       initial="a" version="1.0">
            <state id="a">
                <transition target="b c"/>
            </state>
            <state id="b"/>
            <state id="c"/>
        </scxml>
        `;
    const lAST = parse(lScxmTransitionToMultipleTargets);

    equal(ajv.validate($schema, lAST), true);
    deepEqual(lAST, {
      states: [
        {
          name: "initial",
          type: "initial",
        },
        {
          name: "a",
          type: "regular",
        },
        {
          name: "b",
          type: "regular",
        },
        {
          name: "c",
          type: "regular",
        },
      ],
      transitions: [
        {
          id: 1,
          from: "initial",
          to: "a",
        },
        {
          id: 2,
          from: "a",
          to: "b",
        },
        {
          id: 3,
          from: "a",
          to: "c",
        },
      ],
    });
  });

  it("also processes transitions from parallel states", () => {
    const lScxmlTransitionFromCompoundParallelState = `<?xml version="1.0" encoding="UTF-8"?>
    <scxml version="1.0" initial="ParallelState">
        <parallel id="ParallelState">
            <transition target="Done"/>
            <state id="Region1">
                <state id="State1"/>
            </state>
        </parallel>
        <state id="Done"/>
    </scxml> `;
    const lExpectedAst = {
      states: [
        {
          name: "initial",
          type: "initial",
        },
        {
          name: "Done",
          type: "regular",
        },
        {
          name: "ParallelState",
          type: "parallel",
          typeExplicitlySet: true,
          statemachine: {
            states: [
              {
                name: "Region1",
                type: "regular",
                statemachine: {
                  states: [
                    {
                      name: "State1",
                      type: "regular",
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
      transitions: [
        {
          id: 1,
          from: "initial",
          to: "ParallelState",
        },
        {
          id: 2,
          from: "ParallelState",
          to: "Done",
        },
      ],
    };

    const lAST = parse(lScxmlTransitionFromCompoundParallelState);

    equal(ajv.validate($schema, lAST), true);
    deepEqual(lAST, lExpectedAst);
  });

  it("barfs if the input is invalid xml", () => {
    throws(() => parse("this is no xml"), "That doesn't look like valid xml");
  });

  it("strips spaces before and after the xml content before parsing", () => {
    doesNotThrow(() =>
      parse(
        `     \n\n\n\n <?xml version="1.0" encoding="UTF-8"?><validxml></validxml>    \n\n     `,
      ),
    );
  });
});
