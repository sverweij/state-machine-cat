import { createRequireJSON } from "../utl.js";

const requireJSON = createRequireJSON(import.meta.url);

export default {
  readFixture(pFixtureName) {
    return requireJSON(pFixtureName);
  },
};
