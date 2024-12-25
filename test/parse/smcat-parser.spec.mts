import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { deepEqual, equal } from "node:assert/strict";
import Ajv from "ajv";
import { createRequireJSON } from "../utl.mjs";
import { parse as parseSmCat } from "#parse/smcat/parse.mjs";
import $schema from "#parse/smcat-ast.schema.mjs";

const ajv = new Ajv();

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
  programASTPairs.forEach((pPair) => {
    if (Object.hasOwn(pPair, "pending") && pPair.pending) {
      /* eslint  mocha/no-skipped-tests: off */
      xit(pPair.title);
    } else {
      it(pPair.title, () => {
        const lAST = parseSmCat(pPair.program);

        equal(ajv.validate($schema, lAST), true);
        deepEqual(lAST, pPair.ast);
      });
    }
  });
});

describe("#parse() - file based - ", () => {
  fileBasedPairs.forEach((pPair) => {
    it(pPair.title, () => {
      const lProgram = readFileSync(
        fileURLToPath(new URL(pPair.programInputFile, import.meta.url)),
        "utf8",
      );
      const lAST = parseSmCat(lProgram);

      equal(ajv.validate($schema, lAST), true);
      deepEqual(lAST, requireJSON(`./${pPair.astFixtureFile}`));
    });
  });
});

function assertSyntaxError(pProgram, pParseFunction, pErrorType) {
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
  syntaxErrors.forEach((pPair) => {
    it(pPair.title, () => {
      assertSyntaxError(pPair.program, parseSmCat, pPair.error);
    });
  });
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
/* eslint max-nested-callbacks: 0 */
/* eslint import/max-dependencies: 0, import/no-dynamic-require: 0 */
