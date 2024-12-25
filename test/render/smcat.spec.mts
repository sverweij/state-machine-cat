import { deepEqual } from "node:assert/strict";
import { createRequireJSON } from "../utl.mjs";
import { Counter } from "#counter.mjs";
import render from "#render/smcat.mjs";
import { parse } from "#parse/smcat/parse.mjs";

const requireJSON = createRequireJSON(import.meta.url);

const programASTPairs = requireJSON("../parse/00-no-transitions.json")
  .concat(requireJSON("../parse/01-transitions-only.json"))
  .concat(requireJSON("../parse/03-composite.json"))
  .concat(requireJSON("../parse/04-labels.json"))
  .concat(requireJSON("../parse/05-colors.json"))
  .concat(requireJSON("../parse/06-active.json"))
  .concat(requireJSON("../parse/07-type.json"))
  .concat(requireJSON("../parse/08-transition-type.json"));

// const programASTPairs = requireJSON("../parse/09-classes.json");
describe("#render(smcat) - smcat, happy day ASTs - ", () => {
  programASTPairs.forEach((pPair) => {
    if (Object.hasOwn(pPair, "pending") && pPair.pending) {
      /* eslint mocha/no-skipped-tests: off */
      xit(pPair.title);
    } else {
      it(pPair.title, () => {
        const lRendered = render(pPair.ast);
        deepEqual(parse(lRendered), pPair.ast);
      });
    }
  });
});
