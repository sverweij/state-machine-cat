import { mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { equal, rejects } from "node:assert/strict";
import * as actions from "#cli/actions.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
  pTestPair.input.options.inputFrom = join(
    __dirname,
    pTestPair.input.options.inputFrom,
  );
  pTestPair.input.options.outputTo = join(
    __dirname,
    pTestPair.input.options.outputTo,
  );
  pTestPair.expected = join(__dirname, pTestPair.expected);
  return pTestPair;
});

function resetOutputDirectory() {
  testPairs.forEach((pPair) => {
    try {
      if (pPair.input.options.outputTo) {
        unlinkSync(pPair.input.options.outputTo);
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
            equal(pResult, true);

            // TE DOEN: understand why this fails
            // const lFound = readFileSync(pPair.input.options.outputTo, "utf8");
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
    it("rejects when input exceeds max size", async () => {
      const lFile = join(__dirname, "output", "oversize.smcat");
      try {
        mkdirSync(dirname(lFile), { recursive: true });
      } catch (pError_) {
        // ignore
      }

      const lSize = 4_194_304 + 1; // one byte over the max
      writeFileSync(lFile, "A".repeat(lSize), "utf8");

      const lOptions = {
        inputFrom: lFile,
        inputType: "smcat",
        outputTo: join(__dirname, "output", "oversize.json"),
        outputType: "json",
      };

      await rejects(
        actions.transform(lOptions),
        /Input exceeds maximum sane size/,
      );

      try {
        unlinkSync(lFile);
      } catch (pError_) {
        // ignore
      }
    });
  });

  describe("formatError()", () => {
    it("returns the message of non-syntax errors", () => {
      equal(actions.formatError(new Error("hatsikidee!")), "hatsikidee!");
    });

    it("returns man and horse of syntax errors", () => {
      const lError = new Error("Make my day!");

      lError.location = {
        start: {
          line: 481,
          column: 69,
        },
      };

      equal(
        actions.formatError(lError),
        `\n  syntax error on line 481, column 69:\n  Make my day!\n\n`,
      );
    });
  });
});
/* eslint max-nested-callbacks: 0 */
