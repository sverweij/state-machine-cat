import he from "he";
import type {
  ISCJSONMachine,
  ISCJSONState,
  ISCJSONTransition,
} from "../scjson/scjson.js";

const INDENT_LENGTH = 4;

function indentString(pString: string, pCount: number): string {
  const lRegex = /^(?!\s*$)/gm;

  return pString.replaceAll(lRegex, " ".repeat(pCount));
}

function renderTransitionAttributes(pTransition: ISCJSONTransition): string {
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

function renderRegularTransition(
  pTransition: ISCJSONTransition,
  pDepth: number,
): string {
  const lReturnValue = `
<transition${renderTransitionAttributes(pTransition)}/>`;
  return indentString(lReturnValue, pDepth * INDENT_LENGTH);
}

function renderActionTransition(
  pTransition: ISCJSONTransition & { action: string },
  pDepth: number,
): string {
  const lReturnValue = `
<transition${renderTransitionAttributes(pTransition)}>
    ${he.escape(pTransition.action)}
</transition>`;
  return indentString(lReturnValue, pDepth * INDENT_LENGTH);
}

function renderTransition(
  pTransition: ISCJSONTransition,
  pDepth: number,
): string {
  if (pTransition.action) {
    return renderActionTransition(
      pTransition as ISCJSONTransition & { action: string },
      pDepth,
    );
  }

  return renderRegularTransition(pTransition, pDepth);
}

function renderTransitions(
  pTransitions?: ISCJSONTransition[],
  // @ts-expect-error Yes. pDepth follows optional parameter. So What?
  pDepth: number,
): string {
  return (pTransitions ?? [])
    .map((pTransition) => renderTransition(pTransition, pDepth))
    .join("");
}

function renderSimpleTag(
  pOnExit: string,
  pTag: string,
  pDepth: number,
): string {
  const lReturnValue = `
<${pTag}>${he.escape(pOnExit)}</${pTag}>`;
  return indentString(lReturnValue, pDepth * INDENT_LENGTH);
}

// @ts-expect-error Yes. pDepth follows optional parameter. So What?
function renderOnEntries(pOnEntries?: string[], pDepth: number): string {
  return (pOnEntries ?? [])
    .map((pOnEntry) => renderSimpleTag(pOnEntry, "onentry", pDepth))
    .join("");
}

// @ts-expect-error Yes. pDepth follows optional parameter. So What?
function renderOnExits(pOnExits?: string[], pDepth: number): string {
  return (pOnExits ?? [])
    .map((pOnExit) => renderSimpleTag(pOnExit, "onexit", pDepth))
    .join("");
}

function renderStateAttributes(pState: ISCJSONState): string {
  let lReturnValue = ` id="${he.escape(pState.id)}"`;
  if (pState.initial) {
    lReturnValue += ` initial="${he.escape(pState.initial)}"`;
  }
  if (pState.type) {
    lReturnValue += ` type="${he.escape(pState.type)}"`;
  }
  return lReturnValue;
}

function renderState(pState: ISCJSONState, pDepth: number): string {
  let lReturnValue = `\n<${pState.kind}${renderStateAttributes(pState)}>`;
  // eslint-disable-next-line no-use-before-define -- recursion
  lReturnValue += renderStates(pState.states, pDepth);
  lReturnValue += renderOnEntries(pState.onentries, pDepth);
  lReturnValue += renderOnExits(pState.onexits, pDepth);
  lReturnValue += renderTransitions(pState.transitions, pDepth);
  lReturnValue += `\n</${pState.kind}>`;

  return indentString(lReturnValue, pDepth * INDENT_LENGTH);
}

function renderStates(pStates?: ISCJSONState[], pDepth = 1): string {
  return (pStates ?? []).map((pState) => renderState(pState, pDepth)).join("");
}

function renderInitialAttribute(pInitialString?: string): string {
  return pInitialString ? `initial="${pInitialString}" ` : "";
}

export default function renderSCXML(pSCJSON: ISCJSONMachine): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<scxml xmlns="http://www.w3.org/2005/07/scxml" ${renderInitialAttribute(pSCJSON.initial)}version="1.0">${renderStates(pSCJSON.states)}
</scxml>
`;
}
