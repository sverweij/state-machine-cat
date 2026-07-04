import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { deepEqual, equal } from "node:assert/strict";
import { createRequireJSON } from "../utl.mjs";
import { parse as parseSmCat } from "#parse/smcat/parse.mjs";
import { validate } from "#parse/smcat-ast.validate.mjs";

const requireJSON = createRequireJSON(import.meta.url);

const programASTPairs = requireJSON("./00-no-transitions.json")
  .concat(requireJSON("./01-transitions-only.json"))
  .concat(requireJSON("./03-composite.json"))
  .concat(requireJSON("./04-labels.json"))
  .concat(requireJSON("./05-colors.json"))
  .concat(requireJSON("./06-active.json"))
  .concat(requireJSON("./07-type.json"))
  .concat(requireJSON("./08-transition-type.json"))
  .concat(requireJSON("./09-classes.json"))
  .concat(requireJSON("./10-width.json"));

const fileBasedPairs = requireJSON("./02-comments.json");

const syntaxErrors = requireJSON("./20-no-transitions-errors.json")
  .concat(requireJSON("./21-transition-errors.json"))
  .concat(requireJSON("./22-composition-errors.json"))
  .concat(requireJSON("./23-extra-attribute-errors.json"));

describe("#parse() - happy day ASTs -", () => {
  for (const lPair of programASTPairs) {
    if (Object.hasOwn(lPair, "pending") && lPair.pending) {
      xit(lPair.title);
    } else {
      it(lPair.title, () => {
        const lAST = parseSmCat(lPair.program);

        equal(validate(lAST), true);
        deepEqual(lAST, lPair.ast);
      });
    }
  }
});

describe("#parse() - file based - ", () => {
  for (const lPair of fileBasedPairs) {
    it(lPair.title, () => {
      const lProgram = readFileSync(
        fileURLToPath(new URL(lPair.programInputFile, import.meta.url)),
        "utf8",
      );
      const lAST = parseSmCat(lProgram);

      equal(validate(lAST), true);
      deepEqual(lAST, requireJSON(`./${lPair.astFixtureFile}`));
    });
  }
});

function assertSyntaxError(pProgram, pParseFunction, pErrorType): void {
  if (!pErrorType) {
    pErrorType = "SyntaxError";
  }
  try {
    let lStillRan = false;

    if (pParseFunction(pProgram)) {
      lStillRan = true;
    }
    equal(lStillRan, false);
  } catch (pError) {
    equal(pError.name, pErrorType);
  }
}

describe("#parse() - syntax errors - ", () => {
  for (const lPair of syntaxErrors) {
    it(lPair.title, () => {
      assertSyntaxError(lPair.program, parseSmCat, lPair.error);
    });
  }
});

describe("#parse() - parses the kitchensink", () => {
  it("parses the kitchensink", () => {
    deepEqual(
      parseSmCat(
        readFileSync(
          fileURLToPath(new URL("fixtures/kitchensink.smcat", import.meta.url)),
          "utf8",
        ),
      ),
      requireJSON("./fixtures/kitchensink.json"),
    );
  });
});

describe("#validate() - rejects unsafe color strings", () => {
  it("returns false for AST with unsafe color value", () => {
    const lBadAST = {
      states: [
        {
          name: "foo",
          type: "regular",
          color: 'red" URL="javascript:alert(1)',
        },
      ],
    };

    equal(validate(lBadAST), false);
  });

  it("returns false for AST with unsafe transition color value", () => {
    const lBadAST = {
      states: [
        { name: "foo", type: "regular" },
        { name: "bar", type: "regular" },
      ],
      transitions: [
        {
          id: 1,
          from: "foo",
          to: "bar",
          color: 'red" URL="javascript:alert(1)',
        },
      ],
    };

    equal(validate(lBadAST), false);
  });
});
