import { readFileSync } from "node:fs";

export function createRequireJSON(
  pBaseURL: string,
): (pString: string) => string {
  return function requireJSON(pString: string): string {
    return JSON.parse(readFileSync(new URL(pString, pBaseURL), "utf8"));
  };
}
