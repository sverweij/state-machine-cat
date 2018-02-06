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
