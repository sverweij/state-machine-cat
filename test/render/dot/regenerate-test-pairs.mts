import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequireJSON } from "../../utl.mjs";
import type { IRenderOptions } from "../../../types/state-machine-cat.mjs";
import { TEST_PAIRS } from "./test-pairs.mjs";
import convert from "#render/dot/index.mjs";

const requireJSON = createRequireJSON(import.meta.url);

for (const lPair of TEST_PAIRS) {
  const lResult = convert(
    requireJSON(lPair.input),
    (lPair.options || {}) as IRenderOptions,
  ).replaceAll("\r\n", "\n");
  writeFileSync(
    fileURLToPath(new URL(lPair.expectedOutput, import.meta.url)),
    lResult,
    "utf8",
  );
}
