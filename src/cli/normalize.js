const path = require("path");
const propertiesParser = require("./properties-parser");

const INPUT_EXTENSIONS = {
    "smcat" : "smcat",
    "json"  : "json",
    "ast"   : "json"
};
const OUTPUT_EXTENSIONS = {
    "smcat" : "smcat",
    "dot"   : "dot",
    "json"  : "json",
    "ast"   : "json",
    "scjson": "scjson",
    "scxml" : "scxml",
    "svg"   : "svg"
};

/**
 * Given a filename in pString, returns what language is probably
 * contained in that file, judging from the extension (the last dot
 * in the string to end-of-string)
 *
 * When in doubt returns pDefault
 *
 * @param {string} pString - filename
 * @param {object} pExtensionMap - a dictionary with
 *        extension : classification pairs
 * @param {string} pDefault - the default to return when the extension
 *        does not occur in the extension map
 * @return  {string} - language. Possible values: LHS of the passed
 *        extension map.
 */
function classifyExtension(pString = "-", pExtensionMap, pDefault) {
    const lPos = pString.lastIndexOf(".");

    if (lPos > -1) {
        const lExt = pString.slice(lPos + 1);

        if (pExtensionMap[lExt]) {
            return pExtensionMap[lExt];
        }
    }
    return pDefault;
}

function deriveOutputFromInput(pInputFrom, pOutputType){
    if (!pInputFrom || '-' === pInputFrom){
        return '-';
    }
    return path.join(
        path.dirname(pInputFrom),
        path.basename(pInputFrom, path.extname(pInputFrom))
    ).concat('.').concat(pOutputType);
}

function determineOutputTo(pOutputTo, pInputFrom, pOutputType){
    return Boolean(pOutputTo) ? pOutputTo : deriveOutputFromInput(pInputFrom, pOutputType);
}

function determineInputType (pInputType, pInputFrom){
    return classifyExtension(pInputFrom, INPUT_EXTENSIONS, "smcat");
}

function determineOutputType(pOutputType, pOutputTo){
    if (Boolean(pOutputType)) {
        return pOutputType;
    }
    if (Boolean(pOutputTo)) {
        return classifyExtension(pOutputTo, OUTPUT_EXTENSIONS, "svg");
    }
    return "svg";
}

/**
 * transforms the given argument and options to a uniform format
 *
 * - guesses the input type when not given
 * - guesses the output type when not given
 * - gueses the filename to output to when not given
 * - translates parserOutput to a regular output type
 *
 * @param  {string} pArgument an argument (containing the filename to parse)
 * @param  {object} pOptions a commander options object
 * @return {object} a commander options object with options 'normalized'
 */
module.exports = function (pArgument = '-', pOptions = {}) {
    const lRetval = Object.assign({}, pOptions);

    lRetval.inputFrom  = pArgument || '-';
    lRetval.inputType  =
        determineInputType(
            pOptions.inputType,
            lRetval.inputFrom
        );
    lRetval.outputType =
        determineOutputType(
            pOptions.outputType,
            pOptions.outputTo
        );
    lRetval.outputTo   =
        determineOutputTo(
            pOptions.outputTo,
            lRetval.inputFrom,
            lRetval.outputType
        );
    lRetval.engine =
        pOptions.hasOwnProperty("engine")
            ? pOptions.engine
            : "dot";
    lRetval.direction =
        pOptions.hasOwnProperty("direction")
            ? pOptions.direction
            : "top-down";
    lRetval.dotGraphAttrs =
        pOptions.hasOwnProperty("dotGraphAttrs")
            ? propertiesParser.parse(pOptions.dotGraphAttrs)
            : [];
    return lRetval;
};
