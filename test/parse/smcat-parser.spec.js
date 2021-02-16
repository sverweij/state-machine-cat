/* eslint-disable import/order */
const fs = require("fs");
const path = require("path");
const chai = require("chai");

const expect = chai.expect;
const parser = require("../../src/parse/smcat/smcat-parser");
const $schema = require("../../src/parse/smcat-ast.schema.json");

chai.use(require("chai-json-schema"));

const programASTPairs = require("./00-no-transitions.json")
  .concat(require("./01-transitions-only.json"))
  .concat(require("./03-composite.json"))
  .concat(require("./04-labels.json"))
  .concat(require("./05-colors.json"))
  .concat(require("./06-active.json"))
  .concat(require("./07-type.json"))
  .concat(require("./08-transition-type.json"))
  .concat(require("./09-classes.json"));

const syntaxErrors = require("./10-no-transitions-errors.json")
  .concat(require("./11-transition-errors.json"))
  .concat(require("./12-composition-errors.json"))
  .concat(require("./13-extra-attribute-errors.json"));

const fileBasedPairs = require("./02-comments.json");

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
        const lAST = parser.parse(pPair.program);

        expect(lAST).to.be.jsonSchema($schema);
        expect(lAST).to.deep.equal(pPair.ast);
      });
    }
  });
});

describe("#parse() - file based - ", () => {
  fileBasedPairs.forEach((pPair) => {
    it(pPair.title, () => {
      const lProgram = fs.readFileSync(
        path.join(__dirname, pPair.programInputFile),
        "utf8"
      );
      const lAST = parser.parse(lProgram);

      expect(lAST).to.be.jsonSchema($schema);
      expect(lAST).to.deep.equal(require(`./${pPair.astFixtureFile}`));
    });
  });
});

function assertSyntaxError(pProgram, pParser, pErrorType) {
  if (!pErrorType) {
    pErrorType = "SyntaxError";
  }
  try {
    let lStillRan = false;

    if (pParser.parse(pProgram)) {
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
      assertSyntaxError(pPair.program, parser, pPair.error);
    });
  });
});

describe("#parse() - parses the kitchensink", () => {
  it("parses the kitchensink", () => {
    expect(
      parser.parse(
        fs.readFileSync(
          path.join(__dirname, "fixtures", "kitchensink.smcat"),
          "utf8"
        )
      )
    ).to.deep.equal(require("./fixtures/kitchensink.json"));
  });
});
/* eslint max-nested-callbacks: 0 */
/* eslint import/max-dependencies: 0, import/no-dynamic-require: 0 */
