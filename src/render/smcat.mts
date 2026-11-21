import type {
  IActionType,
  IState,
  IStateMachine,
  IRenderOptions,
  ITransition,
} from "../../types/state-machine-cat.mjs";

// reverse of the identifier symbol in the smcat-parser peg, extended with comments and empty strings
const NAME_QUOTABLE = /(?:^$)|(?:^\/[/*])|(?:[;, "\t\n\r=\-><:{[])/;
const ACTIONS_QUOTABLE = /(?:^")|(?:[;,{}])/;
const LABEL_QUOTABLE = /(?:^")|(?:[;{])|(?:^\s|\s$)/;

const RENDERABLE_STATE_ATTRIBUTES = new Set([
  "label",
  "type",
  "color",
  "active",
  "class",
]);

const RENDERABLE_TRANSITION_ATTRIBUTES = new Set([
  "type",
  "color",
  "class",
  "width",
]);

function quoteIfNecessary(pRegExp: RegExp, pString: string): string {
  return pRegExp.test(pString)
    ? `"${pString.replaceAll('"', String.raw`\"`)}"`
    : pString;
}

function stateHasExtendedAttributes(pState: IState): boolean {
  return (
    Object.hasOwn(pState, "label") ||
    Object.hasOwn(pState, "typeExplicitlySet") ||
    Object.hasOwn(pState, "color") ||
    Object.hasOwn(pState, "active") ||
    Object.hasOwn(pState, "class")
  );
}

function note(pNote: string[], pIndent: string = ""): string {
  return pNote.map((pNoteLine) => `${pIndent}# ${pNoteLine}`).join("\n");
}

function decimalNumber(pValue: number): string {
  const [lMantissa, lExponent] = String(pValue).split("e");
  if (typeof lExponent === "undefined") {
    return lMantissa;
  }
  const lDigits = lMantissa.replace(".", "");
  const lDecimalPosition = lMantissa.includes(".")
    ? lMantissa.indexOf(".") + Number(lExponent)
    : lMantissa.length + Number(lExponent);
  if (lDecimalPosition <= 0) {
    return `0.${"0".repeat(-lDecimalPosition)}${lDigits}`;
  }
  if (lDecimalPosition >= lDigits.length) {
    return lDigits.padEnd(lDecimalPosition, "0");
  }
  return `${lDigits.slice(0, lDecimalPosition)}.${lDigits.slice(lDecimalPosition)}`;
}

function extendedAttribute(pKey: string, pValue: string | number): string {
  if (pKey === "type") {
    // looks a lot like the default return, but this guy's without quotes
    return `${pKey}=${pValue}`;
  }
  if (pKey === "active") {
    return pValue ? pKey : "";
  }
  if (typeof pValue === "number") {
    return `${pKey}=${decimalNumber(pValue)}`;
  }
  return `${pKey}="${pValue.replaceAll('"', '\\"')}"`;
}

function extendedStateAttributes(pState: IState): string {
  return Object.entries(pState)
    .filter(([pKey]) => RENDERABLE_STATE_ATTRIBUTES.has(pKey))
    .filter(([pKey]) => pKey !== "type" || pState.typeExplicitlySet)
    .map(([pKey, pValue]) => extendedAttribute(pKey, pValue))
    .join(" ");
}

function actions(pActions: IActionType[]): string {
  return quoteIfNecessary(
    ACTIONS_QUOTABLE,
    pActions
      .map(
        (pAction) =>
          `${pAction.type === "activity" ? "" : `${pAction.type}/ `}${pAction.body}`,
      )
      .join("\n    "),
  );
}

function state(pState: IState, pIndent: string = ""): string {
  let lReturnValue = pIndent + quoteIfNecessary(NAME_QUOTABLE, pState.name);
  if (pState.note) {
    lReturnValue = `${note(pState.note, pIndent)}\n${lReturnValue}`;
  }
  if (stateHasExtendedAttributes(pState)) {
    lReturnValue += ` [${extendedStateAttributes(pState)}]`;
  }
  if (pState.actions) {
    lReturnValue += `: ${actions(pState.actions)}`;
  }
  if (pState.statemachine) {
    lReturnValue += " {\n";
    // eslint-disable-next-line no-use-before-define
    lReturnValue += renderSmcat(pState.statemachine, null, `${pIndent}    `);
    lReturnValue += `${pIndent}}`;
  }

  return lReturnValue;
}

function states(pStates: IState[], pIndent: string = ""): string {
  return pStates
    .map((pState) => state(pState, pIndent))
    .join(",\n")
    .concat(pStates.length > 0 ? ";\n\n" : "");
}

function transitionHasExtendedAttributes(pTransition: ITransition): boolean {
  return Object.entries(pTransition).some(([pKey]) =>
    RENDERABLE_TRANSITION_ATTRIBUTES.has(pKey),
  );
}

function extendedTransitionAttributes(pTransition: ITransition): string {
  return (
    Object.entries(pTransition)
      .filter(([pKey]) => RENDERABLE_TRANSITION_ATTRIBUTES.has(pKey))
      // lazily re-using the extendedStateAttribute function, even though it does
      // a little more than necessary
      .map(([pKey, pValue]) => extendedAttribute(pKey, pValue))
      .join(" ")
  );
}

function transition(pTransition: ITransition, pIndent: string = ""): string {
  let lReturnValue = `${pIndent}${quoteIfNecessary(NAME_QUOTABLE, pTransition.from)} => ${quoteIfNecessary(
    NAME_QUOTABLE,
    pTransition.to,
  )}`;
  if (pTransition.note) {
    lReturnValue = `${note(pTransition.note, pIndent)}\n${lReturnValue}`;
  }
  if (transitionHasExtendedAttributes(pTransition)) {
    lReturnValue += ` [${extendedTransitionAttributes(pTransition)}]`;
  }
  if (pTransition.label) {
    lReturnValue += `: ${quoteIfNecessary(LABEL_QUOTABLE, pTransition.label)}`;
  }
  return lReturnValue;
}

function transitions(
  pTransitions: ITransition[],
  pIndent: string = "",
): string {
  return pTransitions
    .map((pTransition) => `${transition(pTransition, pIndent)};\n`)
    .join("");
}

export default function renderSmcat(
  pStateMachine: IStateMachine,
  _pOptions: IRenderOptions | null = {},
  pIndent: string = "",
): string {
  return (
    states(pStateMachine.states, pIndent) +
    transitions(pStateMachine.transitions || [], pIndent)
  );
}
