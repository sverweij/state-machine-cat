import { deepEqual } from "node:assert/strict";
import { createRequireJSON } from "../utl.mjs";
import convert from "#render/smcat/index.mjs";
import { parse } from "#parse/smcat/smcat-parser.mjs";

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
    if (Object.hasOwn(pPair, "pending") && pPair.pending) {
      /* eslint mocha/no-skipped-tests: off */
      xit(pPair.title);
    } else {
      it(pPair.title, () => {
        deepEqual(parse(convert(pPair.ast)), pPair.ast);
      });
    }
  });
});
