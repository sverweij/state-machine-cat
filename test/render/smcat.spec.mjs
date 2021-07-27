import { expect } from "chai";
import convert from "../../src/render/smcat/index.js";
import { parse } from "../../src/parse/smcat/smcat-parser.mjs";
import { createRequireJSON } from "../utl.mjs";

const requireJSON = createRequireJSON(import.meta.url);

const programASTPairs = requireJSON("../parse/00-no-transitions.json")
  .concat(requireJSON("../parse/01-transitions-only.json"))
  .concat(requireJSON("../parse/03-composite.json"))
  .concat(requireJSON("../parse/04-labels.json"))
  .concat(requireJSON("../parse/05-colors.json"))
  .concat(requireJSON("../parse/06-active.json"))
  .concat(requireJSON("../parse/07-type.json"))
  .concat(requireJSON("../parse/08-transition-type.json"));

describe("#parse(convert) - happy day ASTs - ", () => {
  programASTPairs.forEach((pPair) => {
    if (
      Object.prototype.hasOwnProperty.call(pPair, "pending") &&
      pPair.pending
    ) {
      /* eslint mocha/no-skipped-tests: off */
      xit(pPair.title);
    } else {
      it(pPair.title, () => {
        expect(parse(convert(pPair.ast))).to.deep.equal(pPair.ast);
      });
    }
  });
});
