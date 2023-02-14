import { createRequireJSON } from "../utl.mjs";

const requireJSON = createRequireJSON(import.meta.url);

export default {
  readFixture(pFixtureName) {
    return requireJSON(pFixtureName);
  },
};
