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

            expect(
                lAST
            ).to.deep.equal(
                JSON.parse(
                    fs.readFileSync(pInputFixture.replace(/\.scxml$/g, ".scxml.re-json"), 'utf8')
                )
            );
            expect(lAST).to.be.jsonSchema($schema);
        });
    });

    it("Generates a dummy state when there's a transtion without a target", () => {
        const SCXML_WITH_TARGETLESS_TRANSITION = `<?xml version="1.0" encoding="UTF-8"?>
            <scxml xmlns="http://www.w3.org/2005/07/scxml" version="1.0">
                <state id="a">
                    <transition/>
                </state>
            </scxml>`;
        const lAST = parser.parse(SCXML_WITH_TARGETLESS_TRANSITION);

        expect(lAST).to.be.jsonSchema($schema);
        expect(lAST).to.deep.equal({
            "states": [
                {
                    "name": "a",
                    "type": "regular"
                },
                {
                    "name": "__no_target__",
                    "type": "regular"
                }
            ],
            "transitions": [
                {
                    "from": "a",
                    "to": "__no_target__"
                }
            ]
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
