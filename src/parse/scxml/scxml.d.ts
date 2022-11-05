/* eslint-disable no-use-before-define, @typescript-eslint/no-explicit-any */
export interface ISCXMLTransition {
  event?: string;
  cond?: string;
  target?: string;
  type?: "external" | "internal";
}

export interface ISCXMLParameter {
  name: string;
  expr?: string;
  location?: string;
}

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

export interface ISCXMLInitialState {
  transition?: ISCXMLTransition; // spec: "occurs once"
}

export interface ISCXMLHistoryState {
  id?: string;
  type?: "shallow" | "deep";
  transition?: ISCXMLTransition; // spec: mandatory. There's also some limitations in what the transition can have as attributes - we're ignoring that for now
}

export interface ISCXMLFinalState {
  id?: string;
  onentry?: string[];
  onexit?: string[];
  donedata?: {
    content?: { expr?: string };
    param?: ISCXMLParameter[];
  };
}

export interface ISCXMLParallelState {
  id?: string;
  onentry?: string[];
  onexit?: string[];
  transition?: ISCXMLTransition[];
  state?: ISCXMLState[];
  parallel?: ISCXMLState[];
  history?: ISCXMLHistoryState[];
  datamodel?: any;
  invoke?: (ISCXMLInvoke | string)[];
}

export interface ISCXMLState {
  id?: string;
  initial?: ISCXMLInitialState | string;
  onentry?: string[];
  onexit?: string[];
  transition?: ISCXMLTransition[];
  state?: ISCXMLState[];
  parallel?: ISCXMLParallelState[];
  final?: ISCXMLFinalState[];
  history?: ISCXMLHistoryState[];
  datamodel?: any;
  invoke?: (ISCXMLInvoke | string)[];
}

export interface ISCXMLMachine {
  // xml attributes
  xmlns: string;
  version: string; // spec: the value must be "1.0"

  // the interesting stuff
  name?: string;
  initial?: ISCXMLState[] | string;
  state?: ISCXMLState[];
  parallel?: ISCXMLState[];
  final?: ISCXMLState[];
  datamodel?: string;
  script?: any;
  binding?: "early" | "late";
}

export interface ISCXMLAsJSON {
  scxml?: ISCXMLMachine;
}
