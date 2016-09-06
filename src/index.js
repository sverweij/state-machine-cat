/* global Viz */
/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) {
    "use strict";

    var parser         = require("./parse/stategenny-parser");
    var ast2stategenny = require("./render/ast2stategenny");
    var ast2dot        = require("./render/ast2dot");
    var viz_lib        = null;
    
    /* istanbul ignore next */
    try {
        viz_lib = require("../node_modules/viz.js/viz"); // requirejs in node >= 5
    } catch (e) {
        try {
            viz_lib = require("../viz.js/viz"); // requirejs in node < 5
        } catch (e2) {
            viz_lib = require("viz.js/viz"); // commonjs
        }
    }

    var viz = typeof viz_lib === 'function' ? viz_lib : Viz;

    function determineOutputType(pOptions) {
        var lRetval = "svg";

        if (Boolean(pOptions) && Boolean(pOptions.outputType)) {
            lRetval = pOptions.outputType;
        }
        return lRetval;
    }

    function determineEngine(/* pAST */) {
        return "dot"; // pAST.states.length > 2 ? "circo" : "dot";
    }

    function determineInputType(pOptions){
        var lRetval = "stategenny";

        if (Boolean(pOptions) && Boolean(pOptions.inputType)) {
            lRetval = pOptions.inputType;
        }

        return lRetval;
    }

    function getAST(pScript, pOptions){
        if (determineInputType(pOptions) === "stategenny") {
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
                case "stategenny":
                    pCallBack(null, ast2stategenny.render(lAST));
                    break;
                case "dot":
                    pCallBack(null, ast2dot.render(lAST));
                    break;
                case "svg":
                    pCallBack(null, viz(ast2dot.render(lAST), {engine: determineEngine(lAST)}));
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
        version: "0.1.0",

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
                    {name: "stategenny", experimental: false},
                    {name: "json",       experimental: false}
                ],
                outputType: [
                    {name: "stategenny", experimental: false},
                    {name: "dot",        experimental: false},
                    {name: "json",       experimental: false},
                    {name: "ast",        experimental: false},
                    {name: "svg",        experimental: false}
                ]
            });
        }

    };
});
/*
 This file is part of stategenny.

 stategenny is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 stategenny is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with stategenny.  If not, see <http://www.gnu.org/licenses/>.
 */
