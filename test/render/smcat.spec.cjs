/* eslint-disable import/max-dependencies, import/order */
const expect = require("chai").expect;
const convert = require("../../src/render/smcat/index.cjs");
const parser = require("../../src/parse/smcat/smcat-parser.cjs");

const programASTPairs = require("../parse/00-no-transitions.json")
  .concat(require("../parse/01-transitions-only.json"))
  .concat(require("../parse/03-composite.json"))
  .concat(require("../parse/04-labels.json"))
  .concat(require("../parse/05-colors.json"))
  .concat(require("../parse/06-active.json"))
  .concat(require("../parse/07-type.json"))
  .concat(require("../parse/08-transition-type.json"));

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
        expect(parser.parse(convert(pPair.ast))).to.deep.equal(pPair.ast);
      });
    }
  });
});
