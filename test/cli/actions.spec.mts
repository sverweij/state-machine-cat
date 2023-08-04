import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { strictEqual } from "node:assert";
import * as actions from "../../src/cli/actions.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const testPairs = [
  {
    title: "Generate a dot",
    input: {
      options: {
        inputFrom: "../parse/fixtures/comment-00-single-after-state.smcat",
        inputType: "smcat",
        outputTo: "output/comment-00-single-after-state.dot",
        outputType: "dot",
      },
    },
    expected: "fixtures/rainbow_mscgen_source.dot",
  },
  {
    title: "Generate an abstract syntax tree",
    input: {
      options: {
        inputFrom: "../parse/fixtures/comment-00-single-after-state.smcat",
        inputType: "smcat",
        outputTo: "output/comment-00-single-after-state.json",
        outputType: "json",
      },
    },
    expected: "fixtures/rainbow_mscgen_source.json",
    // }, {
    //     title : "return an error",
    //     input : {
    //         options : {
    //             inputFrom  : "../parse/fixtures/syntax-error.smcat",
    //             inputType  : "smcat",
    //             outputTo   : "output/comment-00-single-after-state.smcat",
    //             outputType : "smcat"
    //         }
    //     },
    //     expected : "whatever",
    //     expectedError : "Error"
  },
].map((pTestPair) => {
  pTestPair.input.options.inputFrom = path.join(
    __dirname,
    pTestPair.input.options.inputFrom,
  );
  pTestPair.input.options.outputTo = path.join(
    __dirname,
    pTestPair.input.options.outputTo,
  );
  pTestPair.expected = path.join(__dirname, pTestPair.expected);
  return pTestPair;
});

function resetOutputDirectory() {
  testPairs.forEach((pPair) => {
    try {
      // if (!!pPair.input.argument){
      //     fs.unlinkSync(pPair.input.argument);
      // }
      if (Boolean(pPair.input.options.outputTo)) {
        fs.unlinkSync(pPair.input.options.outputTo);
      }
    } catch (pError) {
      // probably files didn't exist in the first place
      // so ignore the exception
    }
  });
}

describe("#cli - actions", () => {
  before("set up", resetOutputDirectory);

  after("tear down", resetOutputDirectory);

  describe("#transform()", () => {
    testPairs.forEach((pPair) => {
      it(pPair.title, (pDone) => {
        actions
          .transform(pPair.input.options)
          .then((pResult) => {
            /* eslint no-unused-expressions:0 */
            strictEqual(pResult, true);

            // TE DOEN: understand why this fails
            // const lFound = fs.readFileSync(pPair.input.options.outputTo, "utf8");
            // console.log(pPair.input.options.outputTo, '\n', lFound);

            // expect(lFound.length).to.be.greaterThan(0);

            pDone();
          })
          .catch((pError) => {
            pDone(pError);
            // expect(pError.name).to.equal(pPair.expected);
          });
      });
    });
  });

  describe("formatError()", () => {
    it("returns the message of non-syntax errors", () => {
      strictEqual(actions.formatError(new Error("hatsikidee!")), "hatsikidee!");
    });

    it("returns man and horse of syntax errors", () => {
      const lError = new Error("Make my day!");

      lError.location = {
        start: {
          line: 481,
          column: 69,
        },
      };

      strictEqual(
        actions.formatError(lError),
        `\n  syntax error on line 481, column 69:\n  Make my day!\n\n`,
      );
    });
  });
});
/* eslint max-nested-callbacks: 0 */
