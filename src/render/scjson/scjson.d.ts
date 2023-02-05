export interface ISCJSONTransition {
  target: string;
  event?: string;
  cond?: string;
  action?: string;
  type?: "external" | "internal";
}

export interface ISCJSONState {
  kind: string;
  id: string;
  type?: "deep" | "shallow";
  initial?: string;
  states?: ISCJSONState[];
  onentries?: string[];
  onexits?: string[];
  transitions?: ISCJSONTransition[];
}

export interface ISCJSONMachine {
  initial?: string;
  states: ISCJSONState[];
}
