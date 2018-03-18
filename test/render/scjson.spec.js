const fs      = require('fs');
const path    = require('path');
const chai    = require('chai');
const convert = require('../../src/render/scjson').render;

const expect  = chai.expect;

const $schema = require('../../src/parse/scjson.schema.json');

chai.use(require('chai-json-schema'));

const FIXTURE_DIR = `${__dirname}/fixtures`;
const FIXTURE_INPUTS = fs
    .readdirSync(FIXTURE_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => path.join(FIXTURE_DIR, f));

describe('#ast2scjson - ', () => {
    FIXTURE_INPUTS.forEach((pInputFixture) => {
        it(`correctly converts ${path.basename(pInputFixture)} to scjson`, () => {
            const lResult = convert(
                JSON.parse(
                    fs.readFileSync(pInputFixture, 'utf8')
                )
            );
            expect(
                lResult
            ).to.deep.equal(
                JSON.parse(
                    fs.readFileSync(pInputFixture.replace(/\.json$/g, ".scjson"), 'utf8')
                )
            );
            expect(lResult).to.jsonSchema($schema);
        });
    });
});
