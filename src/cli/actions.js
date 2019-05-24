/* eslint max-len: 0 */
const getStream      = require("get-stream");
const smcat          = require("../..");
const {getOutStream, getInStream} = require("./fileNameToStream");

const LICENSE = `
    state machine cat - write beautiful state charts

The MIT License (MIT)

Copyright (c) 2016-2019 Sander Verweij

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject
to the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

`;

module.exports = {
    LICENSE,
    transform(pOptions) {
        return getStream(getInStream(pOptions.inputFrom))
            .then(
                (pInput) => {
                    const lOutput = smcat.render(
                        pInput,
                        {
                            inputType: pOptions.inputType,
                            outputType: pOptions.outputType,
                            engine: pOptions.engine,
                            direction: pOptions.direction,
                            dotGraphAttrs: pOptions.dotGraphAttrs,
                            dotNodeAttrs: pOptions.dotNodeAttrs,
                            dotEdgeAttrs: pOptions.dotEdgeAttrs
                        }
                    );
                    return getOutStream(pOptions.outputTo).write(
                        typeof lOutput === 'string' ? lOutput : JSON.stringify(lOutput, null, "    "),
                        'utf8'
                    );
                }

            );
    },

    formatError (pError) {
        if (Boolean(pError.location)){
            return `\n  syntax error on line ${pError.location.start.line}, column ${pError.location.start.column}:\n  ${pError.message}\n\n`;
        }
        return pError.message;
    }
};
