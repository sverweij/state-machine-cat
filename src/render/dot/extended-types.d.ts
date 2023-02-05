import type { IState, ITransition } from "types/state-machine-cat";

export interface IExtendedTransition extends ITransition {
  isCompositeSelf: boolean;
  hasParent: boolean;
  name: string;
  noteName?: string;
  tailportflags?: string;
  headportflags?: string;
  fromComposite?: boolean;
  toComposite?: boolean;
}

export interface IExtendedState extends IState {
  sizingExtras?: string;
  noteName?: string;
  actionStrings?: string[];
  noteFlattened?: string;
  nestedExternalSelfTransitions?: ITransition[];
}

export interface IExtendedStateMachine extends StateMachine {
  initialStates: IExtendedState[];
  regularStates: IExtendedState[];
  historyStates: IExtendedState[];
  deepHistoryStates: IExtendedState[];
  choiceStates: IExtendedState[];
  forkjoinStates: IExtendedState[];
  junctionStates: IExtendedState[];
  terminateStates: IExtendedState[];
  finalStates: IExtendedState[];
  compositeStates: IExtendedState[];
}
