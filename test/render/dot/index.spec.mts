import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { equal } from "node:assert/strict";
import { createRequireJSON } from "../../utl.mjs";
import type { IRenderOptions } from "../../../types/state-machine-cat.mjs";
import { TEST_PAIRS } from "./test-pairs.mjs";
import convert from "#render/dot/index.mjs";

const requireJSON = createRequireJSON(import.meta.url);

describe("render/dot - integration", () => {
  TEST_PAIRS.forEach((pPair) =>
    it(pPair.title, () => {
      equal(
        convert(
          requireJSON(pPair.input),
          (pPair.options || {}) as IRenderOptions,
        ).replaceAll("\r\n", "\n"),
        fs.readFileSync(
          fileURLToPath(new URL(pPair.expectedOutput, import.meta.url)),
          "utf8",
        ),
      );
    }),
  );
});
