import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

function readFixture(pFixtureName) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(pFixtureName, import.meta.url)), "utf8")
  );
}

export default {
  readFixture,
};
