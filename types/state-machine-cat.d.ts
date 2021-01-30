export type StateType =
  | "regular"
  | "initial"
  | "final"
  | "parallel"
  | "choice"
  | "fork"
  | "forkjoin"
  | "history"
  | "deephistory"
  | "join"
  | "junction"
  | "terminate";

export type TransitionType = "external" | "internal";

export type ActionTypeType = "activity" | "entry" | "exit";

export interface IActionType {
  body: string;
  type: ActionTypeType;
}

export interface IState {
  /**
   * The name and identifier of the state. Unique within the root state machine.
   */
  name: string;
  /**
   * What kind of state (or pseudo state) this state is. E.g. 'regular'
   * for normal states or 'initial', 'final', 'choice' etc for pseudo states
   */
  type: StateType;
  /**
   * The display label of the state. If it's not present, most renderers
   * will use the states' name in stead
   */
  label?: string;
  /**
   * A series of actions and their types. The type describe when the action
   * takes place (on entry, exit, or otherwise ('activity'))
   */
  actions?: IActionType[];
  /**
   * State machine nested within the state.
   */
  statemachine?: IStateMachine;
  /**
   * If true the state is considered to be active and rendered as such.
   */
  active?: boolean;
  /**
   * Color to use for rendering the state. Accepts all css color names
   * (\"blue\") and hex notation - with (\"#0000FF77\") or without
   * (\"#0000FF\") transparency.
   */
  color?: string;
  /**
   * Class name to give the state in dot and svg output.
   */
  class?: string;
  /**
   * Comments related to this state. Some renderers will use the note
   * attribute to render a note (i.e. as a post-it) attached to the
   * state.
   */
  note?: string[];
  /**
   * convenience, derived attribute - set to true if there's a state
   * machine inside the state; false in all other cases. For internal
   * use - @deprecated
   */
  isComposite?: boolean;
  /**
   * The default parser derives the `type` from the `name` with inband
   * signaling. The user can override that behavior by explicitly setting
   * the `type`. This attribute is there to express that (and make sure
   * that on next parses & processing it doesn't get accidentily
   * re-derived from the name again)
   */
  typeExplicitlySet?: boolean;
}

export interface ITransition {
  /**
   * The name of the IState the transition is from
   */
  from: string;
  /**
   * The name of the IState the transition is to
   */
  to: string;
  /**
   * A display label to represent this transition. Parsers can parse this
   * label into events conditions and actions.
   */
  label?: string;
  /**
   * Event triggering the transition
   */
  event?: string;
  /**
   * Condition for the transition to occur.
   */
  cond?: string;
  /**
   * Action to execute when the transition occurs.
   */
  action?: string;
  /**
   * Comments related to this transition. Some renderers will use the note
   * attribute to render a note attached to the transition.
   */
  note?: string[];
  /**
   * Color to use for rendering the transition. Accepts all css color
   * names (\"blue\") and hex notation - with (\"#0000FF77\") or without
   * (\"#0000FF\") transparency.
   */
  color?: string;
  /**
   * Class name to give the transition in dot and svg output.
   */
  class?: string;
  /**
   * Whether the transition is "external" (the default) or "internal".
   * See https://www.w3.org/TR/scxml/#transition for details.
   */
  type?: TransitionType;
}

export interface IStateMachine {
  states: IState[];
  transitions?: ITransition[];
}

/**
 * The current (semver compliant) version number string of
 * state machine cat
 *
 * @type {string}
 */
export const version: string;

export interface IAllowedValue {
  default: string;
  values: {
    name: string;
  }[];
}

export interface IAllowedBooleanValue {
  default: boolean;
  values: {
    name: boolean;
  }[];
}
export interface IAllowedValues {
  inputType: IAllowedValue;
  outputType: IAllowedValue;
  engine: IAllowedValue;
  direction: IAllowedValue;
  desugar: IAllowedBooleanValue;
}

/**
 * @returns An object with for each of the options you can pass to
 *          the render function:
 *          - the default value
 *          - the possible values in an array of objects, each of which
 *            has the properties:
 *          - name: the value
 *
 */
export function getAllowedValues(): IAllowedValues;

export type InputType = "smcat" | "json" | "scxml";

export type OutputType =
  | "smcat"
  | "dot"
  | "json"
  | "ast"
  | "svg"
  | "scjson"
  | "scxml";

export type EngineType = "dot" | "circo" | "fdp" | "neato" | "osage" | "twopi";

export type DirectionType =
  | "top-down"
  | "bottom-top"
  | "left-right"
  | "right-left";

export type dotAttrsType = {
  name: string;
  value: string;
}[];

export interface IRenderOptions {
  /**
   * How to interpret the input (defaults to 'smcat')
   */
  inputType?: InputType;
  /**
   * What renderer to use (defaults to 'svg')
   */
  outputType?: OutputType;
  /**
   * For the 'dot' renderer: what engine to use (defaults to 'dot')
   */
  engine?: EngineType;
  /**
   * For the 'dot' renderer: in what direction to plot the states
   * (defaults to 'top-down')
   */
  direction?: DirectionType;
  /**
   * For the 'dot' renderer: Graph attributes to the engine
   */
  dotGraphAttrs?: dotAttrsType;
  /**
   * For the 'dot' renderer: Node attributes to the engine
   */
  dotNodeAttrs?: dotAttrsType;
  /**
   * For the 'dot' renderer: Edge attributes to the engine
   */
  dotEdgeAttrs?: dotAttrsType;
  /**
   * If true state machine cat will replace 'sugar' pseudo states
   * (choice, forks and junctions) with their equivalent meaning
   * (defaults to false).
   *
   * For details: https://github.com/sverweij/state-machine-cat/blob/master/docs/desugar.md
   */
  desugar?: boolean;
}

/**
 * Translates the input script to an outputscript.
 *
 * @param pScript     The script to translate
 * @param pOptions    options influencing parsing & rendering.
 *                    See below for the complete list.
 * @return            the string with the rendered content if
 *                    no error was found
 * @throws            If an error occurred and no callback
 *                    function was passed: the error
 *
 * Options: see https://github.com/sverweij/state-machine-cat/docs/api.md
 *
 */
export function render(
  pScript: IStateMachine | string,
  pOptions: IRenderOptions
): string;
