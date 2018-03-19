const $package   = require('../package.json');
const options    = require('./options');
const parse      = require('./parse');
const ast2smcat  = require("./render/smcat");
const ast2dot    = require("./render/dot");
const ast2svg    = require("./render/svg");
const ast2html   = require("./render/html");
const ast2scjson = require("./render/scjson");
const ast2scxml  = require("./render/scxml");

function getRenderFunction(pOutputType) {
    const OUTPUTTYPE2RENDERFUNCTION = {
        smcat  : ast2smcat,
        dot    : ast2dot,
        svg    : ast2svg,
        html   : ast2html,
        scjson : ast2scjson,
        scxml  : ast2scxml
    };

    return OUTPUTTYPE2RENDERFUNCTION.hasOwnProperty(pOutputType)
        ? OUTPUTTYPE2RENDERFUNCTION[pOutputType]
        : (x) => x;
}

function renderWithoutCallback(pScript, pOptions){
    const lAST = parse.getAST(pScript, pOptions);
    return getRenderFunction(options.getOptionValue(pOptions, "outputType"))(lAST, pOptions);
}

module.exports = {
    /**
     * Translates the input script to an outputscript.
     *
     * @param  {string} pScript     The script to translate
     * @param  {object} pOptions    options influencing parsing & rendering.
     *                              See below for the complete list.
     * @param  {function} pCallBack function with error, success
     *                              parameters. `render` will pass the
     *                              resulting script in the success
     *                              parameter when successful, the error
     *                              message in the error parameter when not.
     *                              (@deprecated)
     * @return {string|void}        nothing if a callback was passed, the
     *                              string with the rendered content if
     *                              no callback was passed and no error was found
     * @throws {Error}              if an error occurred and no callback
     *                              function was passed: the error
     *
     * Options: see https://github.com/sverweij/state-machine-cat/docs/api.md
     *
     */
    render (pScript, pOptions, pCallBack){
        if (Boolean(pCallBack)) {
            try {
                pCallBack(null, renderWithoutCallback(pScript, pOptions));
            } catch (pError) {
                pCallBack(pError);
            }
        } else {
            /* eslint consistent-return: 0 */
            return renderWithoutCallback(pScript, pOptions);
        }
    },

    /**
     * The current (semver compliant) version number string of
     * state machine cat
     *
     * @type {string}
     */
    version: $package.version,

    /**
     * An object with for each of the options you can pass to
     * the render function
     * - the default value
     * - the possible values in an array of objects, each of which
     *   has the properties:
     *   - name: the value
     *
     */
    getAllowedValues: options.getAllowedValues

};
/*
 This file is part of state-machine-cat.

 smcat is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 smcat is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with smcat.  If not, see <http://www.gnu.org/licenses/>.
 */
