import type {
  IStateMachine,
  IRenderOptions,
  IState,
  ITransition,
  StateType,
} from "../../../types/state-machine-cat.mjs";
import { getOptionValue } from "../../options.mjs";
import {
  buildGraphAttributes,
  buildNodeAttributes,
  buildEdgeAttributes,
} from "./attributebuilder.mjs";
import { escapeLabelString } from "./utl.mjs";

function template(pOptions: IRenderOptions, pMachine: string): string {
  const lTemplate = `digraph "state transitions" {
  {{graphAttributes}}
  node [{{nodeAttributes}}]
  edge [{{edgeAttributes}}]

{{machine}}
}
`;
  return lTemplate
    .replace(
      "{{graphAttributes}}",
      buildGraphAttributes(
        getOptionValue(pOptions, "engine") as string,
        getOptionValue(pOptions, "direction") as string,
        pOptions?.dotGraphAttrs || [],
      ),
    )
    .replace(
      "{{nodeAttributes}}",
      buildNodeAttributes(pOptions.dotNodeAttrs || []),
    )
    .replace(
      "{{edgeAttributes}}",
      buildEdgeAttributes(pOptions.dotNodeAttrs || []),
    )
    .replace("{{machine}}", pMachine);
}

function regularState(pState: IState, pIndent: string): string {
  /*
    "{{{name}}}" [margin=0 class="{{{class}}}" {{#if color}}color="{{{color}}}" {{/if}}{{#if active}}peripheries=1 style=rounded {{/if}}label= < 
    <table align="center" cellborder="0" border="2" style="rounded" width="48">
      <tr><td width="48"{{#if actionStrings}} cellpadding="2"{{else}} cellpadding="7"{{/if}}>{{#if active}}<i>{{label}}</i>{{else}}{{label}}{{/if}}</td></tr>
      {{#actionStrings}}
        {{#if @first}}<hr/>{{/if}}
        <tr><td align="left" cellpadding="2">{{.}}</td></tr>
      {{/actionStrings}}
    </table>
  >]
  */
  const lClass = pState.class
    ? `state regular ${pState.class}"`
    : "state regular";
  const lLabel = `
${pIndent}    <table align="center" cellborder="0" border="2" style="rounded" width="48">
${pIndent}      <tr><td width="48" cellpadding="7">${pState.label || pState.name}</td></tr>
${pIndent}    </table>`;
  return `${pIndent}  "${pState.name}" [margin=0 class="${lClass}"${pState.color ? ` color="${pState.color}" ` : ""}${pState.active ? " peripheries=1 style=rounded " : ""} label= <${lLabel}
${pIndent}  >]`;
}
function initialState(pState: IState, pIndent: string): string {
  const lClass = pState.class
    ? `state initial ${pState.class}"`
    : "state initial";
  const lColor = pState.color ?? "black";
  const lActiveAttribute = pState.active ? " penwidth=3.0" : "";

  return `${pIndent}  "${pState.name}" [shape=circle style=filled fixedsize=true height=0.15 label="" class="${lClass}" color="${lColor}" fillcolor="${lColor}"${lActiveAttribute}]`;
}
function finalState(pState: IState, pIndent: string): string {
  const lClass = pState.class ? `state final ${pState.class}"` : "state final";
  const lColor = pState.color ?? "black";
  const lActiveAttribute = pState.active ? " peripheries=2 penwidth=3.0" : "";

  return `${pIndent}  "${pState.name}" [shape=circle style=filled class="${lClass}" color="${lColor}" fillcolor="${lColor}" fixedsize=true height=0.15 peripheries=2 label=""${lActiveAttribute}]`;
}

const STATE_TYPE2FUNCTION = new Map<
  StateType,
  (pState: IState, pIndent: string) => string
>([
  ["initial", initialState],
  ["regular", regularState],
  ["history", regularState],
  ["deephistory", regularState],
  ["choice", regularState],
  ["fork", regularState],
  ["forkjoin", regularState],
  ["join", regularState],
  ["junction", regularState],
  ["terminate", regularState],
  ["final", finalState],
  // parallel
]);

function state(pState: IState, pIndent: string): string {
  return (STATE_TYPE2FUNCTION.get(pState.type) ?? regularState)(
    pState,
    pIndent,
  );
}

function states(pStates: IState[], pIndent: string): string {
  return pStates.map((pState) => state(pState, pIndent)).join(`\n`);
}

function transition(pTransition: ITransition, pIndent: string): string {
  const lLabel = `label="${escapeLabelString(pTransition.label ?? " ")}"`;
  const lColor = pTransition.color
    ? `color="${pTransition.color}" fontcolor="${pTransition.color}"`
    : "";
  const lPenWidth = pTransition.width ? `penwidth=${pTransition.width}` : "";
  const lClass = pTransition.class
    ? `class="transition ${pTransition.class}"`
    : 'class="transition"';
  const lAttributes = [];
  lAttributes.push(lLabel, lColor, lPenWidth, lClass);

  return `${pIndent}  "${pTransition.from}" -> "${pTransition.to}" [${lAttributes.filter(Boolean).join(" ")}]`;
}

function transitions(pTransitions: ITransition[], pIndent: string): string {
  return pTransitions
    .map((pTransition) => transition(pTransition, pIndent))
    .join("\n");
}

function machine(pStateMachine: IStateMachine, pIndent: string): string {
  return `${states(pStateMachine.states, pIndent)}\n\n${transitions(pStateMachine.transitions || [], pIndent)}`;
}

export default function renderDot(
  pStateMachine: IStateMachine,
  pOptions: IRenderOptions,
  pIndent: string = "",
): string {
  return template(pOptions, machine(pStateMachine, pIndent));
}
