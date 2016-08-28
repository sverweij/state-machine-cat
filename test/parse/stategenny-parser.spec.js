const fs     = require("fs");
const path   = require('path');
const expect = require('chai').expect;
const parser = require('../../src/parse/stategenny-parser');

let programASTPairs =
        require("./00-no-transitions.json")
        .concat(require("./01-transitions-only.json"));

let syntaxErrors =
    require("./10-no-transitions-errors.json")
    .concat(require("./11-transition-errors.json"));

let fileBasedPairs =
    require("./02-comments.json");


describe('#parse() - happy day ASTs - ', () => {
    programASTPairs.forEach(pPair => {
        it(pPair.title, () => {
            expect(parser.parse(pPair.program)).to.deep.equal(pPair.ast);
        });
    });
});

describe('#parse() - file based - ', () => {
    fileBasedPairs.forEach(pPair => {
        it(pPair.title, () => {
            let lProgram = fs.readFileSync(path.join(__dirname, pPair.programInputFile), 'utf-8');

            expect(parser.parse(lProgram)).to.deep.equal(require("./" + pPair.astFixtureFile));
        });
    });
});


function assertSyntaxError(pProgram, pParser, pErrorType){
    if (!pErrorType){
        pErrorType = "SyntaxError";
    }
    try {
        var lStillRan = false;
        if (pParser.parse(pProgram)) {
            lStillRan = true;
        }
        expect(lStillRan).to.equal(false);
    } catch (e) {
        expect(e.name).to.equal(pErrorType);
    }
}

describe('#parse() - syntax errors - ', () => {
    syntaxErrors.forEach(pPair => {
        it(pPair.title, () =>  {
            assertSyntaxError(pPair.program, parser, pPair.error);
        });
    });
});
/* eslint max-nested-callbacks: 0 */
