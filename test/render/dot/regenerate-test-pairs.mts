/* eslint-disable security/detect-non-literal-fs-filename */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequireJSON } from "../../utl.mjs";
import type { IRenderOptions } from "../../../types/state-machine-cat.mjs";
import { TEST_PAIRS } from "./test-pairs.mjs";
import convert from "#render/dot/index.mjs";

const requireJSON = createRequireJSON(import.meta.url);

TEST_PAIRS.forEach((pPair) => {
  const lResult = convert(
    requireJSON(pPair.input),
    (pPair.options || {}) as IRenderOptions,
  ).replaceAll("\r\n", "\n");
  writeFileSync(
    fileURLToPath(new URL(pPair.expectedOutput, import.meta.url)),
    lResult,
    "utf8",
  );
});
