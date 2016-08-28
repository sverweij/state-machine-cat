
/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) {
    "use strict";

    var parser         = require("./parse/stategenny-parser");
    var ast2stategenny = require("./render/ast2stategenny");
    var ast2dot        = require('./render/ast2dot');

    function determineOutputType(pOptions) {
        var lRetval = "json";

        if (Boolean(pOptions)) {
            if (Boolean(pOptions.outputType)){
                lRetval = pOptions.outputType;
            }
        }
        return lRetval;
    }

    return {
        /**
         * parses the given script and renders it in the DOM element with
         * id pOptions.elementId.
         *
         * @param  {string} pScript     The script to parse and render.
         * @param  {object} pOptions    options influencing parsing and
         *                              rendering. See below for the complete
         *                              list.
         * @param  {function} pCallBack function with error, success
         *                              parameters. renderMsc will pass the
         *                              resulting svg in the success parameter
         *                              when successful, the error message
         *                              in the error parameter when not.
         * @return none
         *
         * Options:
         *  elementId: the id of the DOM element to render in. Defaults to
         *             "__svg". renderMsc assumes this element to exist.
         */
        render: function (pScript, pOptions, pCallBack){
            pCallBack("not implemented - yet");
        },

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
        translate: function (pScript, pOptions, pCallBack){
            try {
                var lAST = parser.parse(pScript);

                switch (determineOutputType(pOptions)) {
                case "stategenny":
                    pCallBack(null, ast2stategenny.render(lAST));
                    break;
                case "dot":
                    pCallBack(null, ast2dot.render(lAST));
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
                    {name: "stategenny", experimental: false}
                ],
                outputType: [
                    {name: "stategenny", experimental: false},
                    {name: "dot",        experimental: false},
                    {name: "json",       experimental: false},
                    {name: "ast",        experimental: false}
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
