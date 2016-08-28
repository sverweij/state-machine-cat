const path   = require('path');
const expect = require('chai').expect;
const val    = require('../../src/cli/validations');

describe("#cli - validate", () => {
    describe("output type", () => {
        it("OK's on a valid output type", () => {
            expect(val.validOutputType("json")).to.equal("json");
        });
        it("'notavalidOutputType' is not a valid output type", () => {
            let lFoundError = "";

            try {
                val.validOutputType("notavalidOutputType");
            } catch (e) {
                lFoundError = e.message;
            }
            expect(lFoundError).to.contain("error: 'notavalidOutputType' is not a valid output type.");
        });
    });

    describe('#validInputType() - ', () => {
        it("'stategenny' is a valid type", () => {
            expect(val.validInputType("stategenny")).to.equal("stategenny");
        });

        it("'notAValidInputType' is not a valid input type", () => {
            let lFoundError = "";

            try {
                val.validInputType("notAValidInputType");
            } catch (e) {
                lFoundError = e.message;
            }
            expect(lFoundError).to.contain("error: 'notAValidInputType' is not a valid input type");
        });
    });

    describe('#validateArguments() - ', () => {
        it("'-T dot -o kaboeki.dot fixtures/comment-00-single-after-state.stategenny is oki", () => {
            try {
                val.validateArguments(
                    {
                        inputFrom: path.join(__dirname, "../parse/fixtures/comment-00-single-after-state.stategenny"),
                        outputTo: "kaboeki.dot",
                        outputType: "dot"
                    }
                );
                expect("still here").to.equal("still here");
            } catch (e){
                expect(e.message).to.equal("should not be an exception");
            }
        });

        it("'-T stategenny -o - -' is oki", () => {
            try {
                val.validateArguments(
                    {
                        inputFrom: "-",
                        outputTo: "-",
                        outputType: "stategenny"
                    }
                );
                expect("still here").to.equal("still here");
            } catch (e){
                expect(e.message).to.equal("should not be an exception");
            }
        });

        it("'-T ast -o - input-doesnot-exists' complains about non existing file", () => {
            val.validateArguments(
                {
                    inputFrom  : "input-doesnot-exist",
                    outputTo   : "-",
                    outputType : "ast"
                }
            ).then(() => {
                expect("should not be here").to.equal("still here");
            }).catch(e => {
                expect(e.message).to.equal("\n  error: Failed to open input file 'input-doesnot-exist'\n\n");
            });
        });

        it("'-T  -' complains about non specified output file", () => {
            val.validateArguments(
                {
                    inputFrom: "-",
                    outputType: "dot"
                }
            ).then(() => {
                expect("should not be here").to.equal("still here");
            }).catch(e => {
                expect(e.message).to.equal("\n  error: Please specify an output file.\n\n");
            });
        });

        it("complains about non specified input file", () => {
            val.validateArguments({}).then(() => {
                expect("should not be here").to.equal("still here");
            }).catch(e => {
                expect(e.message).to.equal("\n  error: Please specify an input file.\n\n");
            });
        });
    });
});
