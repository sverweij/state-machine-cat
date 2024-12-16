import he from "he";
const INDENT_LENGTH = 4;
function indentString(pString, pCount) {
    const lRegex = /^(?!\s*$)/gm;
    return pString.replace(lRegex, " ".repeat(pCount));
}
function renderTransitionAttributes(pTransition) {
    let lReturnValue = "";
    if (pTransition.event) {
        lReturnValue += ` event="${he.escape(pTransition.event)}"`;
    }
    if (pTransition.cond) {
        lReturnValue += ` cond="${he.escape(pTransition.cond)}"`;
    }
    if (pTransition.type) {
        lReturnValue += ` type="${he.escape(pTransition.type)}"`;
    }
    lReturnValue += ` target="${he.escape(pTransition.target)}"`;
    return lReturnValue;
}
function renderRegularTransition(pTransition, pDepth) {
    const lReturnValue = `
<transition${renderTransitionAttributes(pTransition)}/>`;
    return indentString(lReturnValue, pDepth * INDENT_LENGTH);
}
function renderActionTransition(pTransition, pDepth) {
    const lReturnValue = `
<transition${renderTransitionAttributes(pTransition)}>
    ${he.escape(pTransition.action)}
</transition>`;
    return indentString(lReturnValue, pDepth * INDENT_LENGTH);
}
function renderTransition(pTransition, pDepth) {
    if (pTransition.action) {
        return renderActionTransition(pTransition, pDepth);
    }
    return renderRegularTransition(pTransition, pDepth);
}
function renderTransitions(pTransitions, pDepth) {
    return (pTransitions ?? [])
        .map((pTransition) => renderTransition(pTransition, pDepth))
        .join("");
}
function renderSimpleTag(pOnExit, pTag, pDepth) {
    const lReturnValue = `
<${pTag}>${he.escape(pOnExit)}</${pTag}>`;
    return indentString(lReturnValue, pDepth * INDENT_LENGTH);
}
function renderOnEntries(pOnEntries, pDepth) {
    return (pOnEntries ?? [])
        .map((pOnEntry) => renderSimpleTag(pOnEntry, "onentry", pDepth))
        .join("");
}
function renderOnExits(pOnExits, pDepth) {
    return (pOnExits ?? [])
        .map((pOnExit) => renderSimpleTag(pOnExit, "onexit", pDepth))
        .join("");
}
function renderStateAttributes(pState) {
    let lReturnValue = ` id="${he.escape(pState.id)}"`;
    if (pState.initial) {
        lReturnValue += ` initial="${he.escape(pState.initial)}"`;
    }
    if (pState.type) {
        lReturnValue += ` type="${he.escape(pState.type)}"`;
    }
    return lReturnValue;
}
function renderState(pState, pDepth) {
    let lReturnValue = `\n<${pState.kind}${renderStateAttributes(pState)}>`;
    lReturnValue += renderStates(pState.states, pDepth);
    lReturnValue += renderOnEntries(pState.onentries, pDepth);
    lReturnValue += renderOnExits(pState.onexits, pDepth);
    lReturnValue += renderTransitions(pState.transitions, pDepth);
    lReturnValue += `\n</${pState.kind}>`;
    return indentString(lReturnValue, pDepth * INDENT_LENGTH);
}
function renderStates(pStates, pDepth = 1) {
    return (pStates ?? []).map((pState) => renderState(pState, pDepth)).join("");
}
function renderInitialAttribute(pInitialString) {
    return pInitialString ? `initial="${pInitialString}" ` : "";
}
export default function renderSCXML(pSCJSON) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<scxml xmlns="http://www.w3.org/2005/07/scxml" ${renderInitialAttribute(pSCJSON.initial)}version="1.0">${renderStates(pSCJSON.states)}
</scxml>
`;
}
