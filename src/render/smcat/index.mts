// @ts-expect-error the type definitions for Handlebars don't match what we're
// actually using
import Handlebars from "handlebars/dist/handlebars.runtime.js";
import type {
  IState,
  IStateMachine,
  ITransition,
} from "../../../types/state-machine-cat.mjs";

await import("./smcat.template.cjs");

type IExtendedState = { hasExtendedAttributes?: boolean } & IState;
type IExtendedTransition = { hasExtendedAttributes?: boolean } & ITransition;
type IFlattenedActionsState = { actions: string } & Omit<
  IExtendedState,
  "actions"
>;

const NAME_QUOTABLE = /;|,|{| |\[/;
const ACTIONS_QUOTABLE = /;|,|{/;
const LABEL_QUOTABLE = /;|{/;

/**
 * @param {RegExp} pRegExp
 * @param {string} pString
 * @returns {string}
 */
function quoteIfNecessary(pRegExp: RegExp, pString: string): string {
  return pRegExp.test(pString) ? `"${pString}"` : pString;
}

Handlebars.registerPartial(
  "smcat.template.hbs",
  Handlebars.templates["smcat.template.hbs"],
);

function formatActionType(pString: string): string {
  return pString === "activity" ? "" : `${pString}/ `;
}

function flattenActions(pState: IExtendedState): IFlattenedActionsState {
  return {
    ...pState,
    actions: (pState.actions || [])
      .map((pAction) => `${formatActionType(pAction.type)}${pAction.body}`)
      .join("\n    "),
  };
}

/* eslint complexity:0 */
function flagExtendedStateAttributes(pState: IExtendedState): IExtendedState {
  if (
    Object.hasOwn(pState, "label") ||
    Object.hasOwn(pState, "typeExplicitlySet") ||
    Object.hasOwn(pState, "color") ||
    Object.hasOwn(pState, "active") ||
    Object.hasOwn(pState, "class")
  ) {
    // note & fixme: mutating a parameter here
    pState.hasExtendedAttributes = true;
  }
  return pState;
}

function transformStates(pStates: IState[]): IFlattenedActionsState[] {
  pStates
    .map(flagExtendedStateAttributes)
    .filter((pState) => pState.statemachine)
    .forEach((pState) => {
      // @ts-expect-error because of the filter above the statemachine is
      // sure to exist, although TS currently doesn't detect this.
      // also fixme: mutating a parameter here
      pState.statemachine.states = transformStates(
        // @ts-expect-error - see above
        pState.statemachine.states,
      );
    });

  return pStates.map(flattenActions);
}

function flagExtendedTransitionAttributes(
  pTransition: IExtendedTransition,
): IExtendedTransition {
  if (
    Object.hasOwn(pTransition, "type") ||
    Object.hasOwn(pTransition, "color") ||
    Object.hasOwn(pTransition, "class")
  ) {
    pTransition.hasExtendedAttributes = true;
  }
  return pTransition;
}

function transformTransitions(
  pTransitions: IExtendedTransition[],
): IExtendedTransition[] {
  return pTransitions.map(flagExtendedTransitionAttributes);
}

Handlebars.registerHelper("quotifyState", (pItem: string) =>
  quoteIfNecessary(NAME_QUOTABLE, pItem),
);

Handlebars.registerHelper("quotifyLabel", (pItem: string) =>
  quoteIfNecessary(LABEL_QUOTABLE, pItem),
);

Handlebars.registerHelper("quotifyActions", (pItem: string) =>
  quoteIfNecessary(ACTIONS_QUOTABLE, pItem),
);

export default function renderSmcat(pStateMachine: IStateMachine): string {
  return Handlebars.templates["smcat.template.hbs"]({
    ...pStateMachine,
    states: transformStates(structuredClone(pStateMachine.states)),
    transitions: transformTransitions(
      structuredClone(pStateMachine.transitions || []),
    ),
  });
}
