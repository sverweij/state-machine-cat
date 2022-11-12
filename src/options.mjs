// @ts-check
/** @type {import("../types/state-machine-cat").IAllowedValues} */
const ALLOWED_VALUES = Object.freeze({
  inputType: {
    default: "smcat",
    values: [{ name: "smcat" }, { name: "json" }, { name: "scxml" }],
  },
  outputType: {
    default: "svg",
    values: [
      { name: "ast" },
      { name: "dot" },
      { name: "eps" },
      { name: "json" },
      { name: "oldeps" },
      { name: "oldps" },
      { name: "oldps2" },
      { name: "oldsvg" },
      { name: "pdf" },
      { name: "png" },
      { name: "ps" },
      { name: "ps2" },
      { name: "scjson" },
      { name: "scxml" },
      { name: "smcat" },
      { name: "svg" },
    ],
  },
  engine: {
    default: "dot",
    values: [
      { name: "dot" },
      { name: "circo" },
      { name: "fdp" },
      { name: "neato" },
      { name: "osage" },
      { name: "twopi" },
    ],
  },
  direction: {
    default: "top-down",
    values: [
      { name: "top-down" },
      { name: "bottom-top" },
      { name: "left-right" },
      { name: "right-left" },
    ],
  },
  desugar: {
    default: false,
    values: [{ name: true }, { name: false }],
  },
});

/**
 * Returns the value for the option in the pOption object, and the default
 * for that option in all other cases
 *
 * @param {import("../types/state-machine-cat").IRenderOptions} pOptions - the options as passed in the api `render` function
 * @param {keyof import("../types/state-machine-cat").IRenderOptions} pOptionName - the name of the option
 * @return {string|boolean} value
 */
function getOptionValue(pOptions, pOptionName) {
  // eslint-disable-next-line security/detect-object-injection
  return pOptions?.[pOptionName] ?? ALLOWED_VALUES[pOptionName].default;
}

/**
 * @returns {import("../types/state-machine-cat").IAllowedValues}
 */
function getAllowedValues() {
  return ALLOWED_VALUES;
}

export default {
  getAllowedValues,
  getOptionValue,
};
