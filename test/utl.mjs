import { readFileSync } from "node:fs";

export function createRequireJSON(pBaseURL) {
  return function requireJSON(pString) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    return JSON.parse(readFileSync(new URL(pString, pBaseURL), "utf8"));
  };
}
