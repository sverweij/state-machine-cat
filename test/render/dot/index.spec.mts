import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { equal } from "node:assert/strict";
import { createRequireJSON } from "../../utl.mjs";
import type { IRenderOptions } from "../../../types/state-machine-cat.mjs";
import convert from "#render/dot/index.mjs";

const requireJSON = createRequireJSON(import.meta.url);

const TEST_PAIRS = [
  {
    title: "renders the kitchensink",
    input: "../../parse/fixtures/kitchensink.json",
    expectedOutput: "../../parse/fixtures/kitchensink.dot",
  },
  {
    title: "renders the empty state chart",
    input: "../../parse/fixtures/minimal.json",
    expectedOutput: "../../parse/fixtures/minimal.dot",
  },
  {
    title: "renders pseudo states",
    input: "../../parse/fixtures/pseudostates.json",
    expectedOutput: "../../parse/fixtures/pseudostates.dot",
  },
  {
    title: "renders pseudo states (top-down)",
    input: "../../parse/fixtures/pseudostates.json",
    options: { direction: "top-down" },
    expectedOutput: "../../parse/fixtures/pseudostates.dot",
  },
  {
    title: "renders pseudo states (bottom-top)",
    input: "../../parse/fixtures/pseudostates.json",
    options: { direction: "bottom-top" },
    expectedOutput: "../../parse/fixtures/pseudostates-bottom-top.dot",
  },
  {
    title: "renders pseudo states (left-right)",
    input: "../../parse/fixtures/pseudostates.json",
    options: { direction: "left-right" },
    expectedOutput: "../../parse/fixtures/pseudostates-left-right.dot",
  },
  {
    title: "renders pseudo states (right-left)",
    input: "../../parse/fixtures/pseudostates.json",
    options: { direction: "right-left" },
    expectedOutput: "../../parse/fixtures/pseudostates-right-left.dot",
  },
  {
    title: "renders composite states",
    input: "../../parse/fixtures/composite.json",
    expectedOutput: "../../parse/fixtures/composite.dot",
  },
  {
    title: "renders composite states - explicitly specify dot as engine",
    input: "../../parse/fixtures/composite.json",
    options: { engine: "dot" },
    expectedOutput: "../../parse/fixtures/composite.dot",
  },
  {
    title: "renders composite states - left-right",
    input: "../../parse/fixtures/composite.json",
    options: { direction: "left-right" },
    expectedOutput: "../../parse/fixtures/composite-left-right.dot",
  },
  {
    title: "renders composite states - right-left",
    input: "../../parse/fixtures/composite.json",
    options: { direction: "right-left" },
    expectedOutput: "../../parse/fixtures/composite-right-left.dot",
  },
  {
    title: "renders composite states - bottom-top",
    input: "../../parse/fixtures/composite.json",
    options: { direction: "bottom-top" },
    expectedOutput: "../../parse/fixtures/composite-bottom-top.dot",
  },
  {
    title:
      "renders transitions of composite states even when there's no 'root' transitions",
    input: "../../parse/fixtures/composite_no_root_transitions.json",
    expectedOutput: "../../parse/fixtures/composite_no_root_transitions.dot",
  },
  {
    title: "renders composite self transitions (top-down)",
    input: "../../parse/fixtures/compositewithselftransition.json",
    options: { direction: "top-down" },
    expectedOutput:
      "../../parse/fixtures/compositewithselftransition-top-down.dot",
  },
  {
    title: "renders composite self transitions (bottom-top)",
    input: "../../parse/fixtures/compositewithselftransition.json",
    options: { direction: "bottom-top" },
    expectedOutput:
      "../../parse/fixtures/compositewithselftransition-bottom-top.dot",
  },
  {
    title: "renders composite self transitions (left-right)",
    input: "../../parse/fixtures/compositewithselftransition.json",
    options: { direction: "left-right" },
    expectedOutput:
      "../../parse/fixtures/compositewithselftransition-left-right.dot",
  },
  {
    title: "renders composite self transitions (right-left)",
    input: "../../parse/fixtures/compositewithselftransition.json",
    options: { direction: "right-left" },
    expectedOutput:
      "../../parse/fixtures/compositewithselftransition-right-left.dot",
  },
  {
    title: "renders states with a label",
    input: "../../parse/fixtures/states-with-a-label.json",
    expectedOutput: "../../parse/fixtures/states-with-a-label.dot",
  },
  {
    title: "colors initial states",
    input: "../../parse/fixtures/color-initial.json",
    expectedOutput: "../../parse/fixtures/color-initial.dot",
  },
  {
    title: "colors regular states",
    input: "../../parse/fixtures/color-regular.json",
    expectedOutput: "../../parse/fixtures/color-regular.dot",
  },
  {
    title: "colors composite states",
    input: "../../parse/fixtures/color-composite.json",
    expectedOutput: "../../parse/fixtures/color-composite.dot",
  },
  {
    title: "colors choice states",
    input: "../../parse/fixtures/color-choice.json",
    expectedOutput: "../../parse/fixtures/color-choice.dot",
  },
  {
    title: "colors forkjoin states",
    input: "../../parse/fixtures/color-forkjoin.json",
    expectedOutput: "../../parse/fixtures/color-forkjoin.dot",
  },
  {
    title: "colors history states",
    input: "../../parse/fixtures/color-history.json",
    expectedOutput: "../../parse/fixtures/color-history.dot",
  },
  {
    title: "colors final states",
    input: "../../parse/fixtures/color-final.json",
    expectedOutput: "../../parse/fixtures/color-final.dot",
  },
  {
    title: "colors final states",
    input: "../../parse/fixtures/no-color-final.json",
    expectedOutput: "../../parse/fixtures/no-color-final.dot",
    options: { dotNodeAttrs: [{ name: "color", value: "pink" }] },
  },
  {
    title: "renders pseudo states",
    input: "../../parse/fixtures/pseudostates.json",
    options: { direction: "right-left" },
    expectedOutput: "../../parse/fixtures/pseudostates-right-left.dot",
  },
  {
    title: "renders non-regular child states of parallel states",
    input: "../../parse/fixtures/parallel-with-non-regular-child.json",
    expectedOutput: "../../parse/fixtures/parallel-with-non-regular-child.dot",
  },
];

// TEST_PAIRS.forEach((pPair) => {
//   const lResult = convert(
//     requireJSON(pPair.input),
//     (pPair.options || {}) as IRenderOptions,
//   ).replace(/\r\n/g, "\n");
//   fs.writeFileSync(
//     fileURLToPath(new URL(pPair.expectedOutput, import.meta.url)),
//     lResult,
//     "utf8",
//   );
// });

describe("render/dot - integration", () => {
  TEST_PAIRS.forEach((pPair) =>
    it(pPair.title, () => {
      equal(
        convert(
          requireJSON(pPair.input),
          (pPair.options || {}) as IRenderOptions,
        ).replace(/\r\n/g, "\n"),
        fs.readFileSync(
          fileURLToPath(new URL(pPair.expectedOutput, import.meta.url)),
          "utf8",
        ),
      );
    }),
  );
});
