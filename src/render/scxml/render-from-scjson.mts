import he from "he";
import type {
  ISCJSONMachine,
  ISCJSONState,
  ISCJSONTransition,
} from "../scjson/scjson.js";

const INDENT_LENGTH = 4;

function indentString(pString: string, pCount: number): string {
  const lRegex = /^(?!\s*$)/gm;

  return pString.replace(lRegex, " ".repeat(pCount));
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
  return lReturnValue;
}

function renderRegularTransition(
  pTransition: ISCJSONTransition,
  pDepth: number,
): string {
  const lTransitionTemplate = `
<transition{{transitionattributes}} target="{{target}}"/>`;

  const lReturnValue = lTransitionTemplate
    .replace("{{target}}", he.escape(pTransition.target))
    .replace(
      "{{transitionattributes}}",
      renderTransitionAttributes(pTransition),
    );
  return indentString(lReturnValue, pDepth * INDENT_LENGTH);
}

function renderActionTransition(
  pTransition: ISCJSONTransition & { action: string },
  pDepth: number,
): string {
  const lTransitionTemplate = `
<transition{{transitionattributes}} target="{{target}}">
    {{action}}
</transition>`;
  const lReturnValue = lTransitionTemplate
    .replace("{{target}}", he.escape(pTransition.target))
    .replace(
      "{{transitionattributes}}",
      renderTransitionAttributes(pTransition),
    )
    .replace("{{action}}", he.escape(pTransition.action));
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

function renderOnEntry(pOnEntry: string, pDepth: number): string {
  const lOnEntryTemplate = `
<onentry>{{entry}}</onentry>`;

  const lReturnValue = lOnEntryTemplate.replace(
    "{{entry}}",
    he.escape(pOnEntry),
  );
  return indentString(lReturnValue, pDepth * INDENT_LENGTH);
}

// @ts-expect-error Yes. pDepth follows optional parameter. So What?
function renderOnEntries(pOnEntries?: string[], pDepth: number): string {
  return (pOnEntries ?? [])
    .map((pOnEntry) => renderOnEntry(pOnEntry, pDepth))
    .join("");
}

function renderOnExit(pOnExit: string, pDepth: number): string {
  const lOnExitTemplate = `
<onexit>{{exit}}</onexit>`;

  const lReturnValue = lOnExitTemplate.replace("{{exit}}", he.escape(pOnExit));
  return indentString(lReturnValue, pDepth * INDENT_LENGTH);
}

// @ts-expect-error Yes. pDepth follows optional parameter. So What?
function renderOnExits(pOnExits?: string[], pDepth: number): string {
  return (pOnExits ?? [])
    .map((pOnExit) => renderOnExit(pOnExit, pDepth))
    .join("");
}

function renderStateAtributes(pState: ISCJSONState): string {
  let lReturnValue = "";
  if (pState.initial) {
    lReturnValue += ` initial="${he.escape(pState.initial)}"`;
  }
  if (pState.type) {
    lReturnValue += ` type="${he.escape(pState.type)}"`;
  }
  return lReturnValue;
}

function renderState(pState: ISCJSONState, pDepth: number): string {
  const lStateTemplate = `
<{{kind}} id="{{id}}"{{stateAttributes}}>{{states}}{{onentries}}{{onexits}}{{transitions}}
</{{kind}}>`;

  const lReturnValue = lStateTemplate
    .replaceAll("{{kind}}", pState.kind)
    .replace("{{id}}", pState.id)
    .replace("{{stateAttributes}}", renderStateAtributes(pState))
    // eslint-disable-next-line no-use-before-define -- recursion
    .replace("{{states}}", renderStates(pState.states, pDepth))
    .replace("{{onentries}}", renderOnEntries(pState.onentries, pDepth))
    .replace("{{onexits}}", renderOnExits(pState.onexits, pDepth))
    .replace("{{transitions}}", renderTransitions(pState.transitions, pDepth));
  return indentString(lReturnValue, pDepth * INDENT_LENGTH);
}

function renderStates(pStates?: ISCJSONState[], pDepth = 1): string {
  return (pStates ?? []).map((pState) => renderState(pState, pDepth)).join("");
}

function renderInitialAttribute(pInitialString?: string): string {
  return pInitialString ? `initial="${pInitialString}" ` : "";
}

export default function renderSCXML(pSCJSON: ISCJSONMachine): string {
  const lDocumentTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<scxml xmlns="http://www.w3.org/2005/07/scxml" {{initial}}version="1.0">{{states}}
</scxml>
`;

  return lDocumentTemplate
    .replace("{{initial}}", renderInitialAttribute(pSCJSON.initial))
    .replace("{{states}}", renderStates(pSCJSON.states));
}
