const EVENT_CHAR_FORBIDDEN_RE = /[\u00B7\u0300-\u036F\u203F-\u2040\u0000-\u0029\u002B-\u002C\u002F\u003B-\u0040\u005B-\u0060\u007B-\u00BF\u00D7\u00F7\u0300-\u036F\u037E\u2000-\u200B\u200E-\u206F\u2190-\u2BFF\u2FF0-\u3000\uD800-\uF8FF\uFDD0-\uFDEF\uFFFE-\uFFFF]/g;
const START_EVENT_CHAR_FORBIDDEN_EXTRA_RE = /[.]/g;
function makeValidEventChar(pCandidateEventStringTail) {
    return pCandidateEventStringTail.replace(EVENT_CHAR_FORBIDDEN_RE, "_");
}
function makeValidEventStartChar(pCandidateEventStringStart) {
    let lReturnValue = makeValidEventChar(pCandidateEventStringStart);
    if (lReturnValue.match(START_EVENT_CHAR_FORBIDDEN_EXTRA_RE)) {
        lReturnValue = `_${pCandidateEventStringStart}`;
    }
    return lReturnValue;
}
function makeValidEventName(pCandidateEventName) {
    pCandidateEventName = pCandidateEventName.replace(/\s+/g, " ").trim();
    return makeValidEventStartChar(pCandidateEventName[0]).concat(makeValidEventChar(pCandidateEventName.slice(1)));
}
export default (pCandidateEventNames) => {
    const lCandidateEventNames = pCandidateEventNames || "";
    if (lCandidateEventNames.length === 0) {
        return "empty";
    }
    return lCandidateEventNames
        .split(/[\n\r]+/)
        .filter((pCandidateEventName) => pCandidateEventName.length > 0)
        .map(makeValidEventName)
        .join(" ");
};
