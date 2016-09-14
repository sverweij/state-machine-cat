const fs      = require('fs');
const path    = require('path');
const expect  = require('chai').expect;
const actions = require("../../src/cli/actions");

const testPairs = [
    {
        title : "Generate a dot",
        input : {
            options : {
                inputFrom  : "../parse/fixtures/comment-00-single-after-state.smcat",
                outputTo   : "output/comment-00-single-after-state.dot",
                outputType : "dot"
            }
        },
        expected : "fixtures/rainbow_mscgen_source.dot"
    }, {
        title : "Generate an abstract syntax tree",
        input : {
            options : {
                inputFrom  : "../parse/fixtures/comment-00-single-after-state.smcat",
                outputTo   : "output/comment-00-single-after-state.json",
                outputType : "json"
            }
        },
        expected : "fixtures/rainbow_mscgen_source.json"
    }, {
        title : "return an error",
        input : {
            options : {
                inputFrom  : "../parse/fixtures/syntax-error.smcat",
                outputTo   : "output/comment-00-single-after-state.smcat",
                outputType : "smcat"
            }
        },
        expected : "whatever",
        expectedError : "Error"
    }
].map(pTestPair => {
    pTestPair.input.options.inputFrom = path.join(__dirname, pTestPair.input.options.inputFrom);
    pTestPair.input.options.outputTo = path.join(__dirname, pTestPair.input.options.outputTo);
    pTestPair.expected = path.join(__dirname, pTestPair.expected);
    return pTestPair;
});

function resetOutputDir(){
    testPairs.forEach(pPair => {
        try {
            // if (!!pPair.input.argument){
            //     fs.unlinkSync(pPair.input.argument);
            // }
            if (Boolean(pPair.input.options.outputTo)){
                fs.unlinkSync(pPair.input.options.outputTo);
            }
        } catch (e){
            // probably files didn't exist in the first place
            // so ignore the exception
        }
    });
}


describe("#cli - actions", () => {
    before("set up", () => resetOutputDir());

    after("tear down", () => resetOutputDir());

    describe('#transform()', () => {
        testPairs.forEach(pPair => {
            it(pPair.title, done => {
                actions.transform(
                    pPair.input.options
                ).then(() => {
                    const lFound = fs.readFileSync(pPair.input.options.outputTo, {"encoding" : "utf8"});

                    expect(lFound.length).to.be.greather.than(0);

                    done();
                }).catch(e => {
                    done();
                    expect(e.name).to.equal(pPair.expected);
                });
            });
        });
    });

    describe('formatError()', () => {
        it("returns the message of non-syntax errors", () => {
            expect(actions.formatError(new Error('hatsikidee!'))).to.equal('hatsikidee!');
        });

        it("returns man and horse of syntax errors", () => {
            let lErr = new Error('Make my day!');

            lErr.location = {
                start : {
                    line : 481,
                    column : 69
                }
            };

            expect(
                actions.formatError(lErr)
            ).to.equal(`\n  syntax error on line 481, column 69:\n  Make my day!\n\n`);
        });
    });
});
/* eslint max-nested-callbacks: 0 */
