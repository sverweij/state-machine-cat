import options from "./options.mjs";
import parse from "./parse/index.mjs";
import desugar from "./transform/desugar.mjs";
import getRenderFunction from "./render/index-node.mjs";
import { version } from "./version.mjs";

const KNOWN_OPTIONS = [
  "outputType",
  "inputType",
  "engine",
  "direction",
  "dotNodeAttrs",
  "dotEdgeAttrs",
  "desugar",
];

function isKnownOption(pKnownOptions) {
  return (pCandidateString) => pKnownOptions.includes(pCandidateString);
}

/**
 * Remove all attributes from the input object (which'd typically be
 * originating from commander) that are not known options options so
 * a clean object can be passed through.
 *
 * @param {any} pOptions - an options object e.g. as output from commander
 * @param {string[]} pKnownOptions - a list of known options
 * @return {any} - an options object that only contains stuff we care about
 */
function ejectUnknownOptions(pOptions, pKnownOptions) {
  return Object.keys(pOptions)
    .filter(isKnownOption(pKnownOptions))
    .reduce((pAll, pKey) => {
      // eslint-disable-next-line security/detect-object-injection
      pAll[pKey] = pOptions[pKey];
      return pAll;
    }, {});
}

export default {
  /**
   * Translates the input script to an outputscript.
   *
   * @param  {string} pScript     The script to translate
   * @param  {object} pOptions    options influencing parsing & rendering.
   *                              See below for the complete list.
   * @return {string|void}        nothing if a callback was passed, the
   *                              string with the rendered content if
   *                              no callback was passed and no error was found
   * @throws {Error}              if an error occurred and no callback
   *                              function was passed: the error
   *
   * Options: see https://github.com/sverweij/state-machine-cat/docs/api.md
   *
   */
  render(pScript, pOptions) {
    const lOptions = ejectUnknownOptions(pOptions, KNOWN_OPTIONS);
    const lAST = parse.getAST(pScript, lOptions);
    const lDesugar = options.getOptionValue(lOptions, "desugar");

    return getRenderFunction(options.getOptionValue(lOptions, "outputType"))(
      lDesugar ? desugar(lAST) : lAST,
      lOptions
    );
  },

  /**
   * The current (semver compliant) version number string of
   * state machine cat
   *
   * @type {string}
   */
  version,

  /**
   * Returns an object with each of the options you can pass to
   * the render function
   * - the default value
   * - the possible values in an array of objects, each of which
   *   has the properties:
   *   - name: the value
   *
   */
  getAllowedValues() {
    return options.getAllowedValues();
  },
};
