/* global Viz */
/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) {
    "use strict";

    var parser        = require("./parse/smcat-parser");
    var ast2smcat     = require("./render/ast2smcat");
    var ast2dot       = require("./render/ast2dot");
    var ast2HTMLTable = require("./render/ast2HTMLTable");
    var viz_lib       = require("./lib/viz.js/viz");

    var viz = typeof viz_lib === 'function' ? viz_lib : Viz;

    function determineOutputType(pOptions) {
        var lRetval = "svg";

        if (Boolean(pOptions) && Boolean(pOptions.outputType)) {
            lRetval = pOptions.outputType;
        }
        return lRetval;
    }

    function determineEngine(pOptions) {
        var lRetval = "dot";

        if (Boolean(pOptions) && pOptions.hasOwnProperty("engine")){
            lRetval = pOptions.engine;
        }
        return lRetval;
    }

    function determineInputType(pOptions){
        var lRetval = "smcat";

        if (Boolean(pOptions) && Boolean(pOptions.inputType)) {
            lRetval = pOptions.inputType;
        }

        return lRetval;
    }

    function getAST(pScript, pOptions){
        if (determineInputType(pOptions) === "smcat") {
            return parser.parse(pScript);
        } else { // json or a javascript object
            if (typeof pScript === "string") {
                return JSON.parse(pScript);
            }
            return pScript;
        }
    }

    return {
        /**
         * Translates the input script to an outputscript.
         *
         * @param  {string} pScript     The script to translate
         * @param  {object} pOptions    options influencing parsing & rendering.
         *                              See below for the complete list.
         * @param  {function} pCallBack function with error, success
         *                              parameters. translateMsc will pass the
         *                              resulting script in the success
         *                              parameter when successful, the error
         *                              message in the error parameter when not.
         * @return none
         *
         * Options:
         *   outputType : defaults to "json". Possible values:
         *                allowedValues.outputType
         */
        render: function (pScript, pOptions, pCallBack){
            try {
                var lAST = getAST(pScript, pOptions);

                switch (determineOutputType(pOptions)) {
                case "smcat":
                    pCallBack(null, ast2smcat.render(lAST));
                    break;
                case "dot":
                    pCallBack(null, ast2dot.render(lAST));
                    break;
                case "svg":
                    pCallBack(null, viz(ast2dot.render(lAST), {engine: determineEngine(pOptions)}));
                    break;
                case "html":
                    pCallBack(null, ast2HTMLTable.render(lAST));
                    break;
                default:
                    pCallBack(null, lAST);
                }
            } catch (e) {
                pCallBack(e);
            }
        },

        /**
         * The current (semver compliant) version number string of
         * mscgenjs
         *
         * @type {string}
         */
        version: "1.0.1",

        /**
         * An object with arrays of allowed values for parameters in the
         * render and translateMsc functions. Each entry in these
         * arrays have a name (=the allowed value) and a boolean "experimental"
         * attribute. If that attribute is true, you'll hit a feature that is
         * under development when use that value.
         *
         * pOptions.inputType
         * pOptions.outputType
         *
         */
        getAllowedValues: function() {
            return Object.seal({
                inputType: [
                    {name: "smcat", experimental: false},
                    {name: "json",  experimental: false}
                ],
                outputType: [
                    {name: "smcat", experimental: false},
                    {name: "dot",   experimental: false},
                    {name: "json",  experimental: false},
                    {name: "ast",   experimental: false},
                    {name: "svg",   experimental: false},
                    {name: "html",  experimental: false},
                ],
                engine: [
                    {name: "dot",    experimental: false},
                    {name: "circo",  experimental: false},
                    {name: "fdp",    experimental: false},
                    {name: "neato",  experimental: false},
                    {name: "osage",  experimental: false},
                    {name: "twopi",  experimental: false}
                ]
            });
        }

    };
});
/*
 This file is part of smcat.

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
