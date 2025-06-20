/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * These data types are based on the w3 scxml specification
 * https://www.w3.org/TR/scxml/#Basic
 */

export interface ISCXMLAsJSON {
  scxml?: any;
}

export interface ISCXMLMetaAttributes {
  xmlns: "http://www.w3.org/2005/07/scxml";

  version: "1.0";

  /**
   * The datamodel that this document requires. "null" denotes the Null
   * datamodel, "ecmascript" the ECMAScript datamodel, and "xpath" the
   * XPath datamodel, as defined in B Data Models.
   *
   * Note: in the SCXML spec datamodel is both an attribute (this one)
   * and a _child_. To prevent duplicate keys we've _renamed_ the datamodel
   * attribute to datamodelType.
   */
  datamodelType?: "null" | "ecmascript" | "xpath" | string;

  /**
   * The data binding to use.
   * See [5.3.3 Data Binding](https://www.w3.org/TR/scxml/#DataBinding) for details.
   */
  binding?: "early" | "late";

  /**
   * Defines part or all of the data model.
   */
  datamodel?: string;

  /**
   * Provides scripting capability.
   */
  script?: any;
}

/**
 * W3 specification: [3.2 - scxml](https://www.w3.org/TR/scxml/#scxml)
 */
export interface INormalizedSCXMLMachine extends ISCXMLMetaAttributes {
  /**
   * The id of the default initial state (or states) for this state.
   *
   * Valid values: A legal state specification.
   *
   * In the spec it can be either an attribute xor a child
   */
  initial: ISCXMLInitialState[];

  /**
   * A compound or atomic state.
   */
  state: INormalizedSCXMLState[];

  /**
   * A parallel state.
   */
  parallel: ISCXMLParallelState[];

  /**
   * A top-level final state in the state machine.
   * The SCXML processor must terminate processing when the state machine
   * reaches this state.
   */
  final: ISCXMLFinalState[];

  /**
   * In SCXML the top level object does not have an id. However, we use
   * SCXMLMachines nested into (sub)states, and there they're massively useful -
   * hence allowed nonetheless
   */
  id?: string;

  /**
   * In SCXML the top level no history state can be specified. As we're re-using
   * the ISCXMLMachine for nesting we allow it nonetheless.
   */
  history: ISCXMLHistoryState[];

  /**
   * The name of this state machine. It is for purely informational purposes.
   *
   * Valid values: any valid NMTOKEN
   */
  name?: string;
}

/**
 * W3 specification: [3.3 - state](https://www.w3.org/TR/scxml/#state)
 */
export interface INormalizedSCXMLState {
  /**
   * The identifier for this state. See [3.14 IDs](https://www.w3.org/TR/scxml/#IDs)
   * for details.
   *
   * Valid values: A valid id as defined in [XML Schema](https://www.w3.org/TR/scxml/#Schema)
   */
  id?: string;

  /**
   * The id of the default initial state (or states) for this state.
   *
   * Valid values: A legal state specification.
   *
   * In the spec it can be either an attribute xor a child
   */
  initial?: ISCXMLInitialState | string;

  /**
   * Optional element holding executable content to be run upon entering
   * this state. [3.4 - onentry](https://www.w3.org/TR/scxml/#onentry)
   */
  onentry?: string[];

  /**
   * Optional element holding executable content to be run when exiting
   * this state. [3.4 - onexit](https://www.w3.org/TR/scxml/#onexit)
   */
  onexit?: string[];

  /**
   * Defines an outgoing transition from this state.
   */
  transition?: ISCXMLTransition[];

  /**
   * Defines a sequential substate of the parent state.
   */
  state?: INormalizedSCXMLState[];

  /**
   * Defines a parallel substate.
   */
  parallel?: ISCXMLParallelState[];

  /**
   * Defines a final substate.
   */
  final?: ISCXMLFinalState[];

  /**
   * A child pseudo-state which records the descendant state(s) that the
   * parent state was in the last time the system transitioned from the
   * parent.
   */
  history?: ISCXMLHistoryState[];

  /**
   * Defines part or all of the data model.
   */
  datamodel?: any;

  /**
   * Invokes an external service.
   */
  invoke?: (ISCXMLInvoke | string)[];
}

/**
 * W3 specification: [3.4 - parallel](https://www.w3.org/TR/scxml/#parallel)
 */
export interface ISCXMLParallelState {
  id?: string;
  onentry?: string[];
  onexit?: string[];
  transition?: ISCXMLTransition[];
  state?: INormalizedSCXMLState[];
  parallel?: INormalizedSCXMLState[];
  history?: ISCXMLHistoryState[];
  datamodel?: any;
  invoke?: (ISCXMLInvoke | string)[];
}

/**
 * W3 specification: [3.5 - transition](https://www.w3.org/TR/scxml/#transition)
 */
export interface ISCXMLTransition {
  event?: string;
  cond?: string;
  target?: string;
  type?: "external" | "internal";
  "#text"?: string;
}

/**
 * W3 specification: [3.6 - initial](https://www.w3.org/TR/scxml/#initial)
 */
export interface ISCXMLInitialState {
  /**
   * The id for the `<initial>` state is _not_ part of the SCXML specification.
   * However, we use it anyway for convenience and consistency.
   */
  id: string;
  /**
   * A transition whose 'target' specifies the default initial state(s).
   * Occurs once. In a conformant SCXML document, this transition must not
   * contain 'cond' or 'event' attributes, and must specify a non-null 'target'
   * whose value is a valid state specification consisting solely of descendants
   * of the containing state (see
   * [3.11 Legal State Configurations and Specifications](https://www.w3.org/TR/scxml/#LegalStateConfigurations)
   * for details) This transition _may_ contain executable content.
   *
   * According to the specification can occur once. For convenience and
   * consistency with other states we allow more than one, though.
   */
  transition?: ISCXMLTransition[];
}

/**
 * W3 specification: [3.7 - final](https://www.w3.org/TR/scxml/#final)
 */
export interface ISCXMLFinalState {
  id?: string;
  onentry?: string[];
  onexit?: string[];
  donedata?: {
    content?: { expr?: string };
    param?: ISCXMLParameter[];
  };
}

/**
 * W3 specification: [3.10 - history](https://www.w3.org/TR/scxml/#history)
 */
export interface ISCXMLHistoryState {
  /**
   * The identifier for this pseudo state. See [3.14 IDs](https://www.w3.org/TR/scxml/#IDs)
   * for details.
   */
  id?: string;

  /**
   * Determines whether the active atomic substate(s) of the current state or
   * only its immediate active substate(s) are recorded.
   */
  type?: "shallow" | "deep";

  /**
   * A transition whose 'target' specifies the default history configuration.
   * In a conformant SCXML document, this transition must not contain 'cond'
   * or 'event' attributes, and must specify a non-null 'target' whose value is
   * a valid state specification (see
   * [3.11 Legal State Configurations and Specifications](https://www.w3.org/TR/scxml/#LegalStateConfigurations)
   * for details) This transition _may_ contain executable content.
   *
   * If 'type' is "shallow", then the 'target' of this `<transition>` must contain
   * only immediate children of the parent state. Otherwise it must contain only
   * descendants of the parent.
   *
   * Occurs once. (Note that under the definition of a legal state specification,
   * if the parent of the history element is `<state>` and the default state
   * specification contains a multiple states, then, in a conformant SCXML
   * document, the 'type' of the history element must be "deep" and the states
   * must be atomic descendants of a `<parallel>` element that is itself a
   * descendant of the parent `<state>` element.)
   */
  transition?: ISCXMLTransition;
}

/**
 * W3 specification: [5.7 - param](https://www.w3.org/TR/scxml/#param)
 */
export interface ISCXMLParameter {
  name: string;
  expr?: string;
  location?: string;
}

/**
 * W3 specification: [6.4 - invoke](https://www.w3.org/TR/scxml/#invoke)
 */
export interface ISCXMLInvoke {
  type?: string;
  typeexpr?: string;
  src?: string;
  srcexpr?: string;
  id?: string;
  idlocation?: string;
  namelist?: string;
  autoforward?: boolean;
  param?: ISCXMLParameter[];
  finalize?: any;
  content?: any;
}
