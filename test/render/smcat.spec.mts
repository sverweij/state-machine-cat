import { deepEqual, equal, ok } from "node:assert/strict";
import { createRequireJSON } from "../utl.mjs";
import render from "#render/smcat.mjs";
import { parse } from "#parse/smcat/parse.mjs";
import type { IStateMachine } from "#types/state-machine-cat.mjs";

const requireJSON = createRequireJSON(import.meta.url);

const programASTPairs = requireJSON("../parse/00-no-transitions.json")
  .concat(requireJSON("../parse/01-transitions-only.json"))
  .concat(requireJSON("../parse/03-composite.json"))
  .concat(requireJSON("../parse/04-labels.json"))
  .concat(requireJSON("../parse/05-colors.json"))
  .concat(requireJSON("../parse/06-active.json"))
  .concat(requireJSON("../parse/07-type.json"))
  .concat(requireJSON("../parse/08-transition-type.json"))
  .concat(requireJSON("../parse/09-classes.json"));

describe("#render(smcat) - smcat, happy day ASTs - ", () => {
  for (const lPair of programASTPairs as unknown as {
    title: string;
    pending: boolean;
    ast: IStateMachine;
  }[]) {
    if (Object.hasOwn(lPair, "pending") && lPair.pending) {
      xit(lPair.title);
    } else {
      it(lPair.title, () => {
        const lRendered = render(lPair.ast);
        deepEqual(parse(lRendered), lPair.ast);
      });
    }
  }
});

describe("#render(smcat) - embedded quotes", () => {
  const lPrograms = [
    { title: "state names", program: String.raw`"a\"b";` },
    {
      title: "transition endpoints",
      program: String.raw`"a\"b" => "c\"d";`,
    },
    { title: "actions", program: String.raw`s: "do, \"say\"";` },
    {
      title: "transition labels",
      program: String.raw`a => b: "go; \"now\"";`,
    },
    {
      title: "backslashes before quotes in state names",
      program: String.raw`"a\\\"b";`,
    },
    {
      title: "backslashes before quotes in actions",
      program: String.raw`s: "do, \\\"say\\\"";`,
    },
    {
      title: "backslashes before quotes in transition labels",
      program: String.raw`a => b: "go; \\\"now\\\"";`,
    },
  ];

  for (const lCase of lPrograms) {
    it(`round-trips ${lCase.title}`, () => {
      const lAST = parse(lCase.program);
      deepEqual(parse(render(lAST)), lAST);
    });
  }
});

describe("#render(smcat) - transition label boundary whitespace", () => {
  const lLabels = [
    "  go",
    "go  ",
    "  go  ",
    "\tgo\n",
    "\u00a0go\u00a0",
    "   ",
    ' go \\"now\\" ',
  ];

  for (const lLabel of lLabels) {
    it(`round-trips ${JSON.stringify(lLabel)}`, () => {
      const lAST = parse(`a => b: "${lLabel}";`);
      const lRendered = render(lAST);
      ok(lRendered.endsWith(`a => b: "${lLabel}";\n`));
      deepEqual(parse(lRendered), lAST);
    });
  }

  it("does not quote labels with only internal whitespace", () => {
    const lAST = parse('a => b: "go now";');
    const lRendered = render(lAST);
    ok(lRendered.endsWith("a => b: go now;\n"));
    deepEqual(parse(lRendered), lAST);
  });
});

describe("#render(smcat) - identifiers requiring quotes", () => {
  for (const lIdentifier of ['""', '"//name"', '"/*x*/"', '"/*unfinished"']) {
    it(`round-trips ${lIdentifier} as a state`, () => {
      const lAST = parse(`${lIdentifier};`);
      const lRendered = render(lAST);
      equal(lRendered, `${lIdentifier};\n\n`);
      deepEqual(parse(lRendered), lAST);
    });

    it(`round-trips ${lIdentifier} as both transition endpoints`, () => {
      const lAST = parse(`${lIdentifier} => other; other => ${lIdentifier};`);
      const lRendered = render(lAST);
      ok(
        lRendered.endsWith(
          `${lIdentifier} => other;\nother => ${lIdentifier};\n`,
        ),
      );
      deepEqual(parse(lRendered), lAST);
    });

    it(`round-trips ${lIdentifier} in a nested state machine`, () => {
      const lAST = parse(`outer { ${lIdentifier}; };`);
      const lRendered = render(lAST);
      equal(lRendered, `outer {\n    ${lIdentifier};\n\n};\n\n`);
      deepEqual(parse(lRendered), lAST);
    });
  }

  it("does not quote identifiers with non-leading comment tokens", () => {
    const lAST = parse("a//name, a/*x*/, /name;");
    const lRendered = render(lAST);
    equal(lRendered, "a//name,\na/*x*/,\n/name;\n\n");
    deepEqual(parse(lRendered), lAST);
  });
});
