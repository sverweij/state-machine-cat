/* eslint max-len: 0 */
"use strict";

module.exports = (() => {
    const fs        = require("fs");
    const stategen  = require("../..");

    const LICENSE = `
    stategenny - turns text into state charts
    Copyright (C) 2013-2016 Sander Verweij

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

 `;

    function callback2Promise(pError, pSuccess, pResolve, pReject) {
        if (Boolean(pError)){
            pReject(pError);
        } else {
            pResolve(pSuccess);
        }
    }

    function getOutStream(pOutputTo) {
        /* istanbul ignore if */
        if ("-" === pOutputTo) {
            return process.stdout;
        } else {
            return fs.createWriteStream(pOutputTo);
        }
    }

    function getInStream(pInputFrom) {

        /* istanbul ignore if */
        if ("-" === pInputFrom) {
            return process.stdin;
        } else {
            return fs.createReadStream(pInputFrom);
        }
    }

    function read(pInStream) {
        return new Promise((pResolve, pReject) => {
            let lInput = "";

            pInStream.resume();
            pInStream.setEncoding("utf8");

            pInStream.on("data", pChunk => {
                lInput += pChunk;
            });

            pInStream.on("end", () => {
                try {
                    pInStream.pause();
                    pResolve(lInput);
                } catch (e) {
                    pReject(e);
                }
            });

            pInStream.on("error", (e) => {
                pReject(e);
            });
        });
    }

    function write(pOutput, pOutStream){
        return new Promise((pResolve, pReject) => {
            pOutStream.write(
                typeof pOutput === 'string' ? pOutput : JSON.stringify(pOutput, null, "    "),
                (pError, pSuccess) =>
                    callback2Promise(pError, pSuccess, pResolve, pReject)
            );
        });
    }

    function translate(pInput, pOptions) {
        return new Promise((pResolve, pReject) => {
            stategen.translate(
                pInput,
                {
                    inputType: pOptions.inputType,
                    outputType: pOptions.outputType
                },
                (pError, pSuccess) =>
                    callback2Promise(pError, pSuccess, pResolve, pReject)
            );
        });
    }

    return {
        LICENSE,
        transform(pOptions) {
            return read(getInStream(pOptions.inputFrom))
            .then(pInput => translate(pInput, pOptions))
            .then(pOutput => write(pOutput, getOutStream(pOptions.outputTo)));
        },

        formatError (e) {
            if (Boolean(e.location)){
                return `\n  syntax error on line ${e.location.start.line}, column ${e.location.start.column}:\n  ${e.message}\n\n`;
            } else {
                return e.message;
            }
        }
    };
})();

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
