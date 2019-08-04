const _get = require("lodash.get");

const ALLOWED_VALUES = Object.freeze({
  inputType: {
    default: "smcat",
    values: [{ name: "smcat" }, { name: "json" }, { name: "scxml" }]
  },
  outputType: {
    default: "svg",
    values: [
      { name: "svg" },
      { name: "dot" },
      { name: "smcat" },
      { name: "json" },
      { name: "ast" },
      { name: "html" },
      { name: "scxml" },
      { name: "scjson" },
      { name: "xmi" }
    ]
  },
  engine: {
    default: "dot",
    values: [
      { name: "dot" },
      { name: "circo" },
      { name: "fdp" },
      { name: "neato" },
      { name: "osage" },
      { name: "twopi" }
    ]
  },
  direction: {
    default: "top-down",
    values: [
      { name: "top-down" },
      { name: "bottom-top" },
      { name: "left-right" },
      { name: "right-left" }
    ]
  }
});

/**
 * Returns the value for the option in the pOption object, and the default
 * for that option in all other cases
 *
 * @param {any} pOptions - the options as passed in the api `render` function
 * @param {string} pOptionName - the name of the option
 */
function getOptionValue(pOptions, pOptionName) {
  return _get(
    pOptions,
    pOptionName,
    _get(ALLOWED_VALUES, `${pOptionName}.default`)
  );
}

function getAllowedValues() {
  return ALLOWED_VALUES;
}

module.exports = {
  getAllowedValues,
  getOptionValue
};
