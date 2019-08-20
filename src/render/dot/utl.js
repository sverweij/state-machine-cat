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

module.exports = {
  escapeString,
  escapeLabelString,
  isVertical
};
