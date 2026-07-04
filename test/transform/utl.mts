import { createRequireJSON } from "../utl.mjs";

const requireJSON = createRequireJSON(import.meta.url);

export default {
  readFixture(pFixtureName: string): string {
    return requireJSON(pFixtureName);
  },
};
