import { deepEqual } from "node:assert/strict";
import { createRequireJSON } from "../utl.mjs";
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
  .concat(requireJSON("../parse/08-transition-type.json"))
  .concat(requireJSON("../parse/09-classes.json"));

describe("#render(smcat) - smcat, happy day ASTs - ", () => {
  for (const lPair of programASTPairs) {
    if (Object.hasOwn(lPair, "pending") && lPair.pending) {
      /* eslint mocha/no-skipped-tests: off */
      xit(lPair.title);
    } else {
      it(lPair.title, () => {
        const lRendered = render(lPair.ast);
        deepEqual(parse(lRendered), lPair.ast);
      });
    }
  }
});
