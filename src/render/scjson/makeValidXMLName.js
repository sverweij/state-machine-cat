const uuidv4 = require('uuid/v4');

/*
 * In the XML spec we read: https://www.w3.org/TR/xml/#NT-Name:
 *
 * NameStartChar ::= ":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] |
 *                   [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] |
 *                   [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
 * NameChar      ::= NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
 * Name          ::= NameStartChar (NameChar)*
 *
 * This means that these characters are forbidden for NameStartChar
 * #xD7, #xF7, #x300 - #x36F, #x37E, #x2000 - #x200B, #x200E - #x206F, #x2190 - #x2BFF, #x2FF0 - #x3000,
 * #xD800 - #xF8FF, #xFDD0 - #xFDEF, #xFFFE - #xFFFF
 */

/* eslint no-control-regex: 0, max-len: 0 */
const NAME_CHAR_FORBIDDEN_RE =
    /[\u0000-\u002C|\u002F|\u003B-\u0040|\u005B-\u0060|\u007B-\u00BF|\u00D7|\u00F7|\u0300-\u036F|\u037E|\u2000-\u200B|\u200E-\u206F|\u2190-\u2BFF|\u2FF0-\u3000|\uD800-\uF8FF|\uFDD0-\uFDEF|\uFFFE-\uFFFF]/g;
const START_NAME_CHAR_FORBIDDEN_EXTRA_RE =
    /[-|.|0-9|\u00B7|\u0300-\u036F|\u203F-\u2040]/g;

/**
 * if it's an invalid NameStartChar but a valid NameChar smack a '_' in front of it
 * if it's an invalid NameChar as well - run it through the makeValidNameChars replacer
 */
function makeValidNameStartChar(pCandidateChar){
    let lRetval = makeValidNameChars(pCandidateChar);

    if (lRetval.match(START_NAME_CHAR_FORBIDDEN_EXTRA_RE)) {
        lRetval = `_${pCandidateChar}`;
    }
    return lRetval;
}

function makeValidNameChars(pCandidateNameTail){
    return pCandidateNameTail.replace(NAME_CHAR_FORBIDDEN_RE, '_');
}

/**
 * Takes any string and returns a valid XMLName using these rules:
 *
 * If pCandidateName is not empty:
 *   For all characters in pCandidateName:
 *    if it's not a valid NameChar, replace it with '_'
 *   For the first character:
 *     If it's a valid NameChar, but not a valid NameStartChar, add an '_' in front of the pCandidateName
 *
 * If pCandidateName is empty:
 *  return a uuidv4 with an _ at the front to ensure uniqueness (e.g. SCXML require this of ID's)
 * *
 * @param {string} pCandidateName (optional)
 */
module.exports = function (pCandidateName) {
    pCandidateName = pCandidateName || '';

    if (pCandidateName.length === 0){
        return `_${uuidv4()}`;
    }
    return makeValidNameStartChar(pCandidateName[0])
        .concat(makeValidNameChars(pCandidateName.slice(1)));
};

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
