// @ts-check

/**
 * @param {string} pString
 * @returns {string}
 */
function escapeString(pString) {
  return pString
    .replace(/\\/g, "\\\\")
    .replace(/\n\s*/g, "\\l")
    .replace(/"/g, '\\"')
    .concat("\\l");
}

/**
 * @param {string} pString
 * @returns {string}
 */
function escapeLabelString(pString) {
  return pString
    .replace(/\\/g, "\\\\")
    .replace(/\n\s*/g, "   \\l")
    .replace(/"/g, '\\"')
    .concat("   \\l");
}

/**
 * @param {string} pDirection
 * @returns {boolean}
 */
function isVertical(pDirection) {
  const lDirection = pDirection || "top-down";

  return lDirection === "top-down" || lDirection === "bottom-top";
}

/**
 *
 * @param {import("../../state-machine-model.mjs").default} pStateMachineModel
 * @param {import("../../../types/state-machine-cat").ITransition} pTransition
 * @returns {boolean}
 */
function isCompositeSelf(pStateMachineModel, pTransition) {
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
