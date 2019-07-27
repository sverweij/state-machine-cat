const fs      = require("fs");
const path    = require('path');
const chai    = require('chai');

const expect  = chai.expect;
const parser  = require('../../src/parse/scxml');
const $schema = require('../../src/parse/smcat-ast.schema.json');

chai.use(require('chai-json-schema'));

const FIXTURE_DIR = `${__dirname}/../render/fixtures`;
const FIXTURE_INPUTS = fs
    .readdirSync(FIXTURE_DIR)
    .filter((f) => f.endsWith('.scxml'))
    .map((f) => path.join(FIXTURE_DIR, f));

describe('parse/scxml', () => {
    FIXTURE_INPUTS.forEach((pInputFixture) => {
        it(`correctly converts ${path.basename(pInputFixture)} to json`, () => {
            const lAST = parser.parse(fs.readFileSync(pInputFixture, 'utf8'));

            // expect(
            //     lAST
            // ).to.deep.equal(
            //     JSON.parse(
            //         fs.readFileSync(pInputFixture.replace(/\.scxml$/g, ".json"), 'utf8')
            //     )
            // );
            expect(lAST).to.be.jsonSchema($schema);
        });
    });

    it('barfs if the input is invalid xml', () => {
        expect(() => parser.parse('this is no xml')).to.throw("That doesn't look like valid xml");
    });

    it('strips spaces before and after the xml content before parsing', () => {
        expect(
            () => parser.parse(`     \n\n\n\n <?xml version="1.0" encoding="UTF-8"?><validxml></validxml>    \n\n     `)
        ).to.not.throw();
    });
});
