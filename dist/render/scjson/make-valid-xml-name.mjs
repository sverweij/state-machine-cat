const NAME_CHAR_FORBIDDEN_RE =
	/[\u0000-\u002C\u002F\u003B-\u0040\u005B-\u0060\u007B-\u00BF\u00D7\u00F7\u0300-\u036F\u037E\u2000-\u200B\u200E-\u206F\u2190-\u2BFF\u2FF0-\u3000\uD800-\uF8FF\uFDD0-\uFDEF\uFFFE-\uFFFF]/g;
const START_NAME_CHAR_FORBIDDEN_EXTRA_RE =
	/[-.0-9\u00B7\u0300-\u036F\u203F-\u2040]/g;
function makeValidNameChars(pCandidateNameTail) {
	return pCandidateNameTail.replaceAll(NAME_CHAR_FORBIDDEN_RE, "_");
}
function makeValidNameStartChar(pCandidateChar) {
	let lReturnValue = makeValidNameChars(pCandidateChar);
	if (lReturnValue.match(START_NAME_CHAR_FORBIDDEN_EXTRA_RE)) {
		lReturnValue = `_${pCandidateChar}`;
	}
	return lReturnValue;
}
export default function makeValidXMLName(pCandidateName) {
	pCandidateName = pCandidateName || "";
	if (pCandidateName.length === 0) {
		return `__empty`;
	}
	return makeValidNameStartChar(pCandidateName[0]).concat(
		makeValidNameChars(pCandidateName.slice(1)),
	);
}
