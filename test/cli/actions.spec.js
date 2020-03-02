const fs = require("fs");
const path = require("path");
const chai = require("chai");
const actions = require("../../src/cli/actions");

const expect = chai.expect;
chai.use(require("chai-as-promised"));

const testPairs = [
  {
    title: "Generate a dot",
    input: {
      options: {
        inputFrom: "../parse/fixtures/comment-00-single-after-state.smcat",
        inputType: "smcat",
        outputTo: "output/comment-00-single-after-state.dot",
        outputType: "dot"
      }
    },
    expected: "fixtures/rainbow_mscgen_source.dot"
  },
  {
    title: "Generate an abstract syntax tree",
    input: {
      options: {
        inputFrom: "../parse/fixtures/comment-00-single-after-state.smcat",
        inputType: "smcat",
        outputTo: "output/comment-00-single-after-state.json",
        outputType: "json"
      }
    },
    expected: "fixtures/rainbow_mscgen_source.json"
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
  }
].map(pTestPair => {
  pTestPair.input.options.inputFrom = path.join(
    __dirname,
    pTestPair.input.options.inputFrom
  );
  pTestPair.input.options.outputTo = path.join(
    __dirname,
    pTestPair.input.options.outputTo
  );
  pTestPair.expected = path.join(__dirname, pTestPair.expected);
  return pTestPair;
});

function resetOutputDir() {
  testPairs.forEach(pPair => {
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
  before("set up", resetOutputDir);

  after("tear down", resetOutputDir);

  describe("#transform()", () => {
    testPairs.forEach(pPair => {
      it(pPair.title, done => {
        actions
          .transform(pPair.input.options)
          .then(pResult => {
            /* eslint no-unused-expressions:0 */
            expect(pResult).to.be.true;

            // TE DOEN: understand why this fails
            // const lFound = fs.readFileSync(pPair.input.options.outputTo, "utf8");
            // console.log(pPair.input.options.outputTo, '\n', lFound);

            // expect(lFound.length).to.be.greaterThan(0);

            done();
          })
          .catch(pError => {
            done(pError);
            // expect(pError.name).to.equal(pPair.expected);
          });
      });
    });
  });

  describe("formatError()", () => {
    it("returns the message of non-syntax errors", () => {
      expect(actions.formatError(new Error("hatsikidee!"))).to.equal(
        "hatsikidee!"
      );
    });

    it("returns man and horse of syntax errors", () => {
      const lErr = new Error("Make my day!");

      lErr.location = {
        start: {
          line: 481,
          column: 69
        }
      };

      expect(actions.formatError(lErr)).to.equal(
        `\n  syntax error on line 481, column 69:\n  Make my day!\n\n`
      );
    });
  });
});
/* eslint max-nested-callbacks: 0 */
