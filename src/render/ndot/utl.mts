import type { ITransition } from "types/state-machine-cat.mjs";
import type StateMachineModel from "../../state-machine-model.mjs";

export function escapeString(pString: string): string {
  return pString
    .replace(/\\/g, "\\\\")
    .replace(/\n\s*/g, "\\l")
    .replace(/"/g, '\\"')
    .concat("\\l");
}

export function escapeLabelString(pString: string): string {
  return pString
    .replace(/\\/g, "\\\\")
    .replace(/\n\s*/g, "   \\l")
    .replace(/"/g, '\\"')
    .concat("   \\l");
}

export function isVertical(pDirection: string): boolean {
  const lDirection = pDirection || "top-down";

  return lDirection === "top-down" || lDirection === "bottom-top";
}

export function isCompositeSelf(
  pStateMachineModel: StateMachineModel,
  pTransition: ITransition,
): boolean {
  return (
    pTransition.from === pTransition.to &&
    pStateMachineModel.findStateByName(pTransition.from).statemachine &&
    pTransition.type !== "internal"
  );
}

export default {
  escapeString,
  escapeLabelString,
  isVertical,
  isCompositeSelf,
};
