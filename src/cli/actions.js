/* eslint max-len: 0 */
const pify           = require("pify");
const smcat          = require("../..");
const readFromStream = require("./streamstuff/readFromStream");
const {getOutStream, getInStream} = require("./streamstuff/fileNameToStream");

const LICENSE = `
state machine cat - write beautiful state charts
Copyright (C) 2016 - 2018 Sander Verweij

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

function render(pInput, pOptions) {
    return pify(smcat.render)(
        pInput,
        {
            inputType: pOptions.inputType,
            outputType: pOptions.outputType,
            engine: pOptions.engine,
            direction: pOptions.direction
        }
    );
}

module.exports = {
    LICENSE,
    transform(pOptions) {
        return readFromStream(getInStream(pOptions.inputFrom))
            .then((pInput) => render(pInput, pOptions))
            .then(
                (pOutput) =>
                    getOutStream(pOptions.outputTo)
                        .write(
                            typeof pOutput === 'string' ? pOutput : JSON.stringify(pOutput, null, "    "),
                            'utf8'
                        )
            );
    },

    formatError (pError) {
        if (Boolean(pError.location)){
            return `\n  syntax error on line ${pError.location.start.line}, column ${pError.location.start.column}:\n  ${pError.message}\n\n`;
        }
        return pError.message;
    }
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
