import { doesNotThrow, equal, throws } from "node:assert/strict";
import {
  validOutputType,
  validInputType,
  validEngine,
  validDirection,
  validDotAttrs,
  validateArguments,
} from "#cli/validations.mjs";

describe("#cli - validate", () => {
  describe("output type", () => {
    it("OK's on a valid output type", () => {
      equal(validOutputType("json"), "json");
    });
    it("'notavalidOutputType' is not a valid output type", () => {
      let lFoundError = "";

      try {
        validOutputType("notavalidOutputType");
      } catch (pError) {
        lFoundError = pError.message;
      }
      equal(
        lFoundError.includes(
          "error: 'notavalidOutputType' is not a valid output type.",
        ),
        true,
      );
    });
  });

  describe("#validInputType() - ", () => {
    it("'smcat' is a valid type", () => {
      equal(validInputType("smcat"), "smcat");
    });

    it("'notAValidInputType' is not a valid input type", () => {
      let lFoundError = "";

      try {
        validInputType("notAValidInputType");
      } catch (pError) {
        lFoundError = pError.message;
      }
      equal(
        lFoundError.includes(
          "error: 'notAValidInputType' is not a valid input type",
        ),
        true,
      );
    });
  });

  describe("#validEngine() - ", () => {
    it("'circo' is a valid type", () => {
      equal(validEngine("circo"), "circo");
    });

    it("'Ford diesel engine' is not a valid engine", () => {
      let lFoundError = "";

      try {
        validEngine("Ford diesel engine");
      } catch (pError) {
        lFoundError = pError.message;
      }
      equal(lFoundError.includes("is not a valid input type"), true);
    });
  });

  describe("#validDirection() - ", () => {
    it("'left-right' is a valid type", () => {
      equal(validDirection("left-right"), "left-right");
    });

    it("'to-the-moon-and-back' is not a valid type", () => {
      let lFoundError = "";

      try {
        validDirection("to-the-moon-and-back");
      } catch (pError) {
        lFoundError = pError.message;
      }
      equal(
        lFoundError.includes(
          "error: 'to-the-moon-and-back' is not a valid direction",
        ),
        true,
      );
    });
  });

  describe("#validDotAttrs() - ", () => {
    it("'aap=noot' is a valid dot attribute", () => {
      equal(validDotAttrs("aap=noot"), "aap=noot");
    });

    it("aap is not a valid dot attribute", () => {
      let lFoundError = "";

      try {
        validDotAttrs("aap");
      } catch (pError) {
        lFoundError = pError.message;
      }
      equal(
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
        validateArguments({
          inputFrom: new URL(
            "../parse/fixtures/comment-00-single-after-state.smcat",
            import.meta.url,
          ),
          outputTo: "kaboeki.dot",
          outputType: "dot",
        });
        equal("still here", "still here");
      } catch (pError) {
        equal(pError.message, "should not be an exception");
      }
    });

    it("'-T smcat -o - -' is oki", () => {
      doesNotThrow(() => {
        validateArguments({
          inputFrom: "-",
          outputTo: "-",
          outputType: "smcat",
        });
      });
    });

    it("'-T ast -o - input-doesnot-exists' complains about non existing file", () => {
      throws(
        () => {
          validateArguments({
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
          validateArguments({
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
          validateArguments({});
        },
        { message: "\n  error: Please specify an input file.\n\n" },
      );
    });
  });
});
