import { expect } from "chai";
import validations from "../../src/cli/validations.mjs";

describe("#cli - validate", () => {
  describe("output type", () => {
    it("OK's on a valid output type", () => {
      expect(validations.validOutputType("json")).to.equal("json");
    });
    it("'notavalidOutputType' is not a valid output type", () => {
      let lFoundError = "";

      try {
        validations.validOutputType("notavalidOutputType");
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
      expect(validations.validInputType("smcat")).to.equal("smcat");
    });

    it("'notAValidInputType' is not a valid input type", () => {
      let lFoundError = "";

      try {
        validations.validInputType("notAValidInputType");
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
      expect(validations.validEngine("circo")).to.equal("circo");
    });

    it("'Ford diesel engine' is not a valid engine", () => {
      let lFoundError = "";

      try {
        validations.validEngine("Ford diesel engine");
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
      expect(validations.validDirection("left-right")).to.equal("left-right");
    });

    it("'to-the-moon-and-back' is not a valid type", () => {
      let lFoundError = "";

      try {
        validations.validDirection("to-the-moon-and-back");
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
      expect(validations.validDotAttrs("aap=noot")).to.equal("aap=noot");
    });

    it("aap is not a valid dot attribute", () => {
      let lFoundError = "";

      try {
        validations.validDotAttrs("aap");
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
        validations.validateArguments({
          inputFrom: new URL(
            "../parse/fixtures/comment-00-single-after-state.smcat",
            import.meta.url
          ),
          outputTo: "kaboeki.dot",
          outputType: "dot",
        });
        expect("still here").to.equal("still here");
      } catch (pError) {
        expect(pError.message).to.equal("should not be an exception");
      }
    });

    it("'-T smcat -o - -' is oki", () => {
      expect(() => {
        validations.validateArguments({
          inputFrom: "-",
          outputTo: "-",
          outputType: "smcat",
        });
      }).to.not.throw();
    });

    it("'-T ast -o - input-doesnot-exists' complains about non existing file", () => {
      expect(() => {
        validations.validateArguments({
          inputFrom: "input-doesnot-exist",
          outputTo: "-",
          outputType: "ast",
        });
      }).to.throw(
        "\n  error: Failed to open input file 'input-doesnot-exist'\n\n"
      );
    });

    it("'-T  -' complains about non specified output file", () => {
      expect(() => {
        validations.validateArguments({
          inputFrom: "-",
          outputType: "ast",
        });
      }).to.throw("\n  error: Please specify an output file.\n\n");
    });

    it("complains about non specified input file", () => {
      expect(() => {
        validations.validateArguments({});
      }).to.throw("\n  error: Please specify an input file.\n\n");
    });
  });
});
