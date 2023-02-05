import type StateMachineModel from "src/state-machine-model.mjs";
import type { ITransition } from "types/state-machine-cat.js";

function escapeString(pString: string): string {
  return pString
    .replace(/\\/g, "\\\\")
    .replace(/\n\s*/g, "\\l")
    .replace(/"/g, '\\"')
    .concat("\\l");
}

function escapeLabelString(pString: string): string {
  return pString
    .replace(/\\/g, "\\\\")
    .replace(/\n\s*/g, "   \\l")
    .replace(/"/g, '\\"')
    .concat("   \\l");
}

function isVertical(pDirection: string): boolean {
  const lDirection = pDirection || "top-down";

  return lDirection === "top-down" || lDirection === "bottom-top";
}

function isCompositeSelf(
  pStateMachineModel: StateMachineModel,
  pTransition: ITransition
): boolean {
  return (
    pTransition.from === pTransition.to &&
    pStateMachineModel.findStateByName(pTransition.from).statemachine &&
    !(pTransition.type === "internal")
  );
}

export default {
  escapeString,
  escapeLabelString,
  isVertical,
  isCompositeSelf,
};
