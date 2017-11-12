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

    function getOptionValue(pOptions, pOption) {
        var lRetval = getAllowedValues()[pOption].default;

        if (Boolean(pOptions) && pOptions.hasOwnProperty(pOption)){
            lRetval = pOptions[pOption];
        }
        return lRetval;
    }

    function getAST(pScript, pOptions){
        if (getOptionValue(pOptions, "inputType") === "smcat") {
            return parser.parse(pScript);
        } else { // json or a javascript object
            if (typeof pScript === "string") {
                return JSON.parse(pScript);
            }
            return pScript;
        }
    }

    function getAllowedValues() {
        return Object.seal({
            inputType: {
                default: "smcat",
                values: [
                    {name: "smcat"},
                    {name: "json"}
                ]
            },
            outputType: {
                default: "svg",
                values: [
                    {name: "smcat"},
                    {name: "dot"},
                    {name: "json"},
                    {name: "ast"},
                    {name: "svg"},
                    {name: "html"}
                ]
            },
            engine: {
                default: "dot",
                values: [
                    {name: "dot"},
                    {name: "circo"},
                    {name: "fdp"},
                    {name: "neato"},
                    {name: "osage"},
                    {name: "twopi"}
                ]
            },
            direction: {
                default: "top-down",
                values: [
                    {name: "top-down"},
                    {name: "left-right"}
                ]
            }
        });
    }

    function ast2svg(pAST, pOptions) {
        return viz(
            ast2dot.render(pAST, pOptions),
            {engine: getOptionValue(pOptions, "engine")}
        );
    }

    function getRenderFunction(pOutputType) {
        var OUTPUTTYPE2RENDERFUNCTION = {
            smcat: ast2smcat.render,
            dot  : ast2dot.render,
            svg  : ast2svg,
            html : ast2HTMLTable.render
        };

        function identityFunction(x) {
            return x;
        }

        return OUTPUTTYPE2RENDERFUNCTION.hasOwnProperty(pOutputType)
            ? OUTPUTTYPE2RENDERFUNCTION[pOutputType]
            : identityFunction;
    }

    return {
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
         * @return none
         *
         * Options: see https://github.com/sverweij/state-machine-cat/docs/api.md
         *
         */
        render: function (pScript, pOptions, pCallBack){
            try {
                var lAST = getAST(pScript, pOptions);

                pCallBack(null, getRenderFunction(getOptionValue(pOptions, "outputType"))(lAST, pOptions));
            } catch (e) {
                pCallBack(e);
            }
        },

        /**
         * The current (semver compliant) version number string of
         * state machine cat
         *
         * @type {string}
         */
        version: "2.1.1",

        /**
         * An object with arrays of allowed values for parameters in the
         * render function. Each entry in these
         * arrays have a name (=the allowed value) and a boolean "experimental"
         * attribute. If that attribute is true, you'll hit a feature that is
         * under development when use that value.
         *
         * pOptions.inputType
         * pOptions.outputType
         *
         */
        getAllowedValues: getAllowedValues

    };
});
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
