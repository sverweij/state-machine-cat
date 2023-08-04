import { doesNotThrow, strictEqual, throws } from "node:assert";
import validations from "../../src/cli/validations.mjs";

describe("#cli - validate", () => {
  describe("output type", () => {
    it("OK's on a valid output type", () => {
      strictEqual(validations.validOutputType("json"), "json");
    });
    it("'notavalidOutputType' is not a valid output type", () => {
      let lFoundError = "";

      try {
        validations.validOutputType("notavalidOutputType");
      } catch (pError) {
        lFoundError = pError.message;
      }
      strictEqual(
        lFoundError.includes(
          "error: 'notavalidOutputType' is not a valid output type.",
        ),
        true,
      );
    });
  });

  describe("#validInputType() - ", () => {
    it("'smcat' is a valid type", () => {
      strictEqual(validations.validInputType("smcat"), "smcat");
    });

    it("'notAValidInputType' is not a valid input type", () => {
      let lFoundError = "";

      try {
        validations.validInputType("notAValidInputType");
      } catch (pError) {
        lFoundError = pError.message;
      }
      strictEqual(
        lFoundError.includes(
          "error: 'notAValidInputType' is not a valid input type",
        ),
        true,
      );
    });
  });

  describe("#validEngine() - ", () => {
    it("'circo' is a valid type", () => {
      strictEqual(validations.validEngine("circo"), "circo");
    });

    it("'Ford diesel engine' is not a valid engine", () => {
      let lFoundError = "";

      try {
        validations.validEngine("Ford diesel engine");
      } catch (pError) {
        lFoundError = pError.message;
      }
      strictEqual(lFoundError.includes("is not a valid input type"), true);
    });
  });

  describe("#validDirection() - ", () => {
    it("'left-right' is a valid type", () => {
      strictEqual(validations.validDirection("left-right"), "left-right");
    });

    it("'to-the-moon-and-back' is not a valid type", () => {
      let lFoundError = "";

      try {
        validations.validDirection("to-the-moon-and-back");
      } catch (pError) {
        lFoundError = pError.message;
      }
      strictEqual(
        lFoundError.includes(
          "error: 'to-the-moon-and-back' is not a valid direction",
        ),
        true,
      );
    });
  });

  describe("#validDotAttrs() - ", () => {
    it("'aap=noot' is a valid dot attribute", () => {
      strictEqual(validations.validDotAttrs("aap=noot"), "aap=noot");
    });

    it("aap is not a valid dot attribute", () => {
      let lFoundError = "";

      try {
        validations.validDotAttrs("aap");
      } catch (pError) {
        lFoundError = pError.message;
      }
      strictEqual(
        lFoundError.includes(
          'Invalid dot attributes: Expected name value pair but "a" found.',
        ),
        true,
      );
    });
  });

  describe("#validateArguments() - ", () => {
    it("'-T dot -o kaboeki.dot fixtures/comment-00-single-after-state.smcat is oki", () => {
      try {
        validations.validateArguments({
          inputFrom: new URL(
            "../parse/fixtures/comment-00-single-after-state.smcat",
            import.meta.url,
          ),
          outputTo: "kaboeki.dot",
          outputType: "dot",
        });
        strictEqual("still here", "still here");
      } catch (pError) {
        strictEqual(pError.message, "should not be an exception");
      }
    });

    it("'-T smcat -o - -' is oki", () => {
      doesNotThrow(() => {
        validations.validateArguments({
          inputFrom: "-",
          outputTo: "-",
          outputType: "smcat",
        });
      });
    });

    it("'-T ast -o - input-doesnot-exists' complains about non existing file", () => {
      throws(
        () => {
          validations.validateArguments({
            inputFrom: "input-doesnot-exist",
            outputTo: "-",
            outputType: "ast",
          });
        },
        {
          message:
            "\n  error: Failed to open input file 'input-doesnot-exist'\n\n",
        },
      );
    });

    it("'-T  -' complains about non specified output file", () => {
      throws(
        () => {
          validations.validateArguments({
            inputFrom: "-",
            outputType: "ast",
          });
        },
        { message: "\n  error: Please specify an output file.\n\n" },
      );
    });

    it("complains about non specified input file", () => {
      throws(
        () => {
          validations.validateArguments({});
        },
        { message: "\n  error: Please specify an input file.\n\n" },
      );
    });
  });
});
