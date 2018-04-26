const fs             = require("fs");
const chai           = require("chai");
const readFromStream = require("../../../src/cli/streamstuff/readFromStream");

chai.use(require("chai-as-promised"));

const expect  = chai.expect;

describe('readFromStream()', () => {
    it("returns a promise that resolves to text from the stream", () => {
        expect(
            readFromStream(
                fs.createReadStream(`${__dirname}/readFromStream.spec.js`)
            )
        ).to.eventually.equal(
            fs.readFileSync(`${__dirname}/readFromStream.spec.js`, 'utf8')
        );
    });
});
