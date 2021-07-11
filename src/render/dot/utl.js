function escapeString(pString) {
  return pString
    .replace(/\\/g, "\\\\")
    .replace(/\n\s*/g, "\\l")
    .replace(/"/g, '\\"')
    .concat("\\l");
}

function escapeLabelString(pString) {
  return pString
    .replace(/\\/g, "\\\\")
    .replace(/\n\s*/g, "   \\l")
    .replace(/"/g, '\\"')
    .concat("   \\l");
}

function isVertical(pDirection) {
  const lDirection = pDirection || "top-down";

  return lDirection === "top-down" || lDirection === "bottom-top";
}

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
