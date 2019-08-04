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

export type ActionTypeType = "activity" | "entry" | "exit";

export interface IActionType {
  body: string;
  type: ActionTypeType;
}

export interface IState {
  /**
   * the name and identifier of the state
   */
  name: string;
  /**
   * what kind of state (or pseudo state) this state is. E.g. 'regular'
   * for normal states or 'initial', 'final', 'choice' etc for pseudo states
   */
  type: StateType;
  /**
   * the display label of the state. If it's not present, most renderers
   * will use the states' name in stead
   */
  label?: string;
  actions?: IActionType[];
  /**
   * state machine nested within the stated
   */
  statemachine?: IStateMachine;
  active?: boolean;
  /**
   * some renderers will use the color attribute to color the state
   * in their output
   */
  color?: string;
  /**
   * some renderers will use the note attribute to render a note
   * (i.e. as a post-it) attached to the stated
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
   * reference to the name of the IState the transition is from
   */
  from: string;
  /**
   * reference to the name of the IState the transition is from
   */
  to: string;
  /**
   * display label of he transition
   */
  label?: string;
  event?: string;
  cond?: string;
  action?: string;
  note?: string[];
  color?: string;
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
  values: Array<{
    name: string;
  }>;
}

export interface IAllowedBooleanValue {
  default: boolean;
  values: Array<{
    name: boolean;
  }>;
}
export interface IAllowedValues {
  inputType: IAllowedValue;
  outputType: IAllowedValue;
  engine: IAllowedValue;
  direction: IAllowedValue;
  desugar: IAllowedBooleanValue;
}

/**
 * An object with for each of the options you can pass to
 * the render function
 * - the default value
 * - the possible values in an array of objects, each of which
 *   has the properties:
 *   - name: the value
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
  | "html"
  | "scjson"
  | "scxml"
  | "xmi";

export type EngineType = "dot" | "circo" | "fdp" | "neato" | "osage" | "twopi";

export type DirectionType =
  | "top-down"
  | "bottom-top"
  | "left-right"
  | "right-left";

export type dotAttrsType = Array<{
  name: string;
  value: string;
}>;

export interface IRenderOptions {
  inputType?: InputType;
  outputType?: OutputType;
  engine?: EngineType;
  direction?: DirectionType;
  dotGraphAttrs?: dotAttrsType;
  dotNodeAttrs?: dotAttrsType;
  dotEdgeAttrs?: dotAttrsType;
  desugar?: boolean;
}

/**
 * Translates the input script to an outputscript.
 *
 * @param  {string} pScript     The script to translate
 * @param  {object} pOptions    options influencing parsing & rendering.
 *                              See below for the complete list.
 * @return {string}             the string with the rendered content if
 *                              no error was found
 * @throws {Error}              if an error occurred and no callback
 *                              function was passed: the error
 *
 * Options: see https://github.com/sverweij/state-machine-cat/docs/api.md
 *
 */
export function render(
  pScript: IStateMachine | string,
  pOptions: IRenderOptions
): string;
