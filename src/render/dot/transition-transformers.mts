import type { ITransition } from "types/state-machine-cat.mjs";
import type { IExtendedTransition } from "./extended-types.js";
import stateTransformers from "./state-transformers.mjs";
import Counter from "./counter.mjs";
import utl from "./utl.mjs";
import StateMachineModel from "#state-machine-model.mjs";

export function escapeTransitionStrings(
  pTransition: Partial<IExtendedTransition>,
): Partial<IExtendedTransition> {
  const lTransition = { ...pTransition };

  if (lTransition.note) {
    lTransition.note = lTransition.note.map(utl.escapeString);
  }
  if (lTransition.label) {
    lTransition.label = utl.escapeLabelString(lTransition.label);
  }
  return lTransition;
}

export function addPorts(pDirection: string) {
  return (pTransition: IExtendedTransition): IExtendedTransition => {
    let lAdditionalAttributes = {};

    if (pTransition.isCompositeSelf) {
      if (utl.isVertical(pDirection)) {
        lAdditionalAttributes = {
          tailportflags: `tailport="e" headport="e"`,
          headportflags: `tailport="w"`,
        };
      } else if (pTransition.hasParent) {
        lAdditionalAttributes = {
          tailportflags: `tailport="n" headport="n"`,
          headportflags: `tailport="s"`,
        };
      } else {
        lAdditionalAttributes = {
          tailportflags: `tailport="s" headport="s"`,
          headportflags: `tailport="n"`,
        };
      }
    }
    return { ...pTransition, ...lAdditionalAttributes };
  };
}

export function classifyTransition(
  pTransition: Partial<IExtendedTransition>,
): Partial<IExtendedTransition> {
  const lClasses = ["transition"];
  if (pTransition.type) {
    lClasses.push(pTransition.type);
  }
  if (pTransition.class) {
    lClasses.push(pTransition.class.trim().replace(/[ ]{2,}/g, " "));
  }

  pTransition.class = lClasses.join(" ");
  return pTransition;
}

export function nameTransition(pCounter: Counter) {
  return (pTransition: ITransition): Partial<IExtendedTransition> => {
    const lTransition: Partial<IExtendedTransition> =
      structuredClone(pTransition);
    lTransition.name = `tr_${pTransition.from}_${
      pTransition.to
    }_${pCounter.nextAsString()}`;

    if (Boolean(pTransition.note)) {
      lTransition.noteName = `note_${lTransition.name}`;
    }

    return pTransition;
  };
}

export function addEndTypes(pStateMachineModel) {
  return (pTransition: Partial<IExtendedTransition>) => {
    if (pStateMachineModel.findStateByName(pTransition.from).statemachine) {
      pTransition.fromComposite = true;
    }
    if (pStateMachineModel.findStateByName(pTransition.to).statemachine) {
      pTransition.toComposite = true;
    }

    return pTransition;
  };
}

export function addCompositeSelfFlag(pStateMachineModel) {
  return (pTransition: ITransition) => {
    let lAdditionalAttributes = {};

    if (utl.isCompositeSelf(pStateMachineModel, pTransition)) {
      if (pStateMachineModel.findStateByName(pTransition.from).hasParent) {
        lAdditionalAttributes = { hasParent: true, isCompositeSelf: true };
      } else {
        lAdditionalAttributes = { isCompositeSelf: true };
      }
    }
    return { ...pTransition, ...lAdditionalAttributes };
  };
}

export function transformTransitions(
  pStateMachineModel: StateMachineModel,
  pDirection: string,
  pCounter: Counter,
) {
  return pStateMachineModel.flattenedTransitions
    .map(nameTransition(pCounter))
    .map(escapeTransitionStrings)
    .map(classifyTransition)
    .map(stateTransformers.flattenNote)
    .map(addEndTypes(pStateMachineModel))
    .map(addCompositeSelfFlag(pStateMachineModel))
    .map(addPorts(pDirection));
}

export default { escapeTransitionStrings, addPorts, classifyTransition };
