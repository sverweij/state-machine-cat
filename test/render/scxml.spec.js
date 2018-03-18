const fs      = require('fs');
const path    = require('path');
const expect  = require('chai').expect;
const convert = require('../../src/render/scxml');

const FIXTURE_DIR = `${__dirname}/fixtures`;
const FIXTURE_INPUTS = fs
    .readdirSync(FIXTURE_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => path.join(FIXTURE_DIR, f));

describe('#ast2scxml - ', () => {
    FIXTURE_INPUTS.forEach((pInputFixture) => {
        it(`correctly converts ${path.basename(pInputFixture)} to scxml`, () => {
            expect(
                convert(
                    JSON.parse(
                        fs.readFileSync(pInputFixture, 'utf8')
                    )
                )
            ).to.deep.equal(
                fs.readFileSync(pInputFixture.replace(/\.json$/g, ".scxml"), 'utf8')
            );
        });
    });
});
