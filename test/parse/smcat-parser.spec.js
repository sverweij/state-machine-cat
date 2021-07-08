/* eslint-disable import/order */
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { expect, use } from "chai";
import chaiJsonSchema from "chai-json-schema";
import { parse as parseSmCat } from "../../src/parse/smcat/smcat-parser.js";
import $schema from "../../src/parse/smcat-ast.schema.js";

use(chaiJsonSchema);

function requireJSON(pString) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(pString, import.meta.url)), "utf8")
  );
}

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

describe("#parse() - happy day ASTs - ", () => {
  programASTPairs.forEach((pPair) => {
    if (
      Object.prototype.hasOwnProperty.call(pPair, "pending") &&
      pPair.pending
    ) {
      /* eslint  mocha/no-skipped-tests: off */
      xit(pPair.title);
    } else {
      it(pPair.title, () => {
        const lAST = parseSmCat(pPair.program);

        expect(lAST).to.be.jsonSchema($schema);
        expect(lAST).to.deep.equal(pPair.ast);
      });
    }
  });
});

describe("#parse() - file based - ", () => {
  fileBasedPairs.forEach((pPair) => {
    it(pPair.title, () => {
      const lProgram = readFileSync(
        fileURLToPath(new URL(pPair.programInputFile, import.meta.url)),
        "utf8"
      );
      const lAST = parseSmCat(lProgram);

      expect(lAST).to.be.jsonSchema($schema);
      expect(lAST).to.deep.equal(requireJSON(`./${pPair.astFixtureFile}`));
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
    expect(lStillRan).to.equal(false);
  } catch (pError) {
    expect(pError.name).to.equal(pErrorType);
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
    expect(
      parseSmCat(
        readFileSync(
          fileURLToPath(new URL("fixtures/kitchensink.smcat", import.meta.url)),
          "utf8"
        )
      )
    ).to.deep.equal(requireJSON("./fixtures/kitchensink.json"));
  });
});
/* eslint max-nested-callbacks: 0 */
/* eslint import/max-dependencies: 0, import/no-dynamic-require: 0 */
