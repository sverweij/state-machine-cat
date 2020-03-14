const path = require("path");
const expect = require("chai").expect;
const value = require("../../src/cli/validations");

describe("#cli - validate", () => {
  describe("output type", () => {
    it("OK's on a valid output type", () => {
      expect(value.validOutputType("json")).to.equal("json");
    });
    it("'notavalidOutputType' is not a valid output type", () => {
      let lFoundError = "";

      try {
        value.validOutputType("notavalidOutputType");
      } catch (pError) {
        lFoundError = pError.message;
      }
      expect(lFoundError).to.contain(
        "error: 'notavalidOutputType' is not a valid output type."
      );
    });
  });

  describe("#validInputType() - ", () => {
    it("'smcat' is a valid type", () => {
      expect(value.validInputType("smcat")).to.equal("smcat");
    });

    it("'notAValidInputType' is not a valid input type", () => {
      let lFoundError = "";

      try {
        value.validInputType("notAValidInputType");
      } catch (pError) {
        lFoundError = pError.message;
      }
      expect(lFoundError).to.contain(
        "error: 'notAValidInputType' is not a valid input type"
      );
    });
  });

  describe("#validEngine() - ", () => {
    it("'circo' is a valid type", () => {
      expect(value.validEngine("circo")).to.equal("circo");
    });

    it("'Ford diesel engine' is not a valid engine", () => {
      let lFoundError = "";

      try {
        value.validEngine("Ford diesel engine");
      } catch (pError) {
        lFoundError = pError.message;
      }
      expect(lFoundError).to.contain(
        "error: 'Ford diesel engine' is not a valid input type"
      );
    });
  });

  describe("#validDirection() - ", () => {
    it("'left-right' is a valid type", () => {
      expect(value.validDirection("left-right")).to.equal("left-right");
    });

    it("'to-the-moon-and-back' is not a valid type", () => {
      let lFoundError = "";

      try {
        value.validDirection("to-the-moon-and-back");
      } catch (pError) {
        lFoundError = pError.message;
      }
      expect(lFoundError).to.contain(
        "error: 'to-the-moon-and-back' is not a valid direction"
      );
    });
  });

  describe("#validDotAttrs() - ", () => {
    it("'aap=noot' is a valid dot attribute", () => {
      expect(value.validDotAttrs("aap=noot")).to.equal("aap=noot");
    });

    it("aap is not a valid dot attribute", () => {
      let lFoundError = "";

      try {
        value.validDotAttrs("aap");
      } catch (pError) {
        lFoundError = pError.message;
      }
      expect(lFoundError).to.contain(
        'Invalid dot attributes: Expected name value pair but "a" found.'
      );
    });
  });

  describe("#validateArguments() - ", () => {
    it("'-T dot -o kaboeki.dot fixtures/comment-00-single-after-state.smcat is oki", () => {
      try {
        value.validateArguments({
          inputFrom: path.join(
            __dirname,
            "../parse/fixtures/comment-00-single-after-state.smcat"
          ),
          outputTo: "kaboeki.dot",
          outputType: "dot"
        });
        expect("still here").to.equal("still here");
      } catch (pError) {
        expect(pError.message).to.equal("should not be an exception");
      }
    });

    it("'-T smcat -o - -' is oki", () => {
      try {
        value.validateArguments({
          inputFrom: "-",
          outputTo: "-",
          outputType: "smcat"
        });
        expect("still here").to.equal("still here");
      } catch (pError) {
        expect(pError.message).to.equal("should not be an exception");
      }
    });

    it("'-T ast -o - input-doesnot-exists' complains about non existing file", () => {
      value
        .validateArguments({
          inputFrom: "input-doesnot-exist",
          outputTo: "-",
          outputType: "ast"
        })
        .then(() => {
          expect("should not be here").to.equal("still here");
        })
        .catch(pError => {
          expect(pError.message).to.equal(
            "\n  error: Failed to open input file 'input-doesnot-exist'\n\n"
          );
        });
    });

    it("'-T  -' complains about non specified output file", () => {
      value
        .validateArguments({
          inputFrom: "-",
          outputType: "dot"
        })
        .then(() => {
          expect("should not be here").to.equal("still here");
        })
        .catch(pError => {
          expect(pError.message).to.equal(
            "\n  error: Please specify an output file.\n\n"
          );
        });
    });

    it("complains about non specified input file", () => {
      value
        .validateArguments({})
        .then(() => {
          expect("should not be here").to.equal("still here");
        })
        .catch(pError => {
          expect(pError.message).to.equal(
            "\n  error: Please specify an input file.\n\n"
          );
        });
    });
  });
});
