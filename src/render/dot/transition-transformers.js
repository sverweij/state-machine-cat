const utl = require("./utl");

function escapeTransitionStrings(pTransition) {
  if (pTransition.note) {
    pTransition.note = pTransition.note.map(utl.escapeString);
  }
  if (pTransition.label) {
    pTransition.label = utl.escapeLabelString(pTransition.label);
  }
  return pTransition;
}

function addPorts(pDirection) {
  return pTransition => {
    let lAdditionalAttributes = {};
    if (pTransition.isCompositeSelf) {
      if (utl.isVertical(pDirection)) {
        lAdditionalAttributes = {
          tailportflags: `tailport="e" headport="e"`,
          headportflags: `tailport="w"`
        };
      } else {
        lAdditionalAttributes = {
          tailportflags: `tailport="s" headport="s"`,
          headportflags: `tailport="n"`
        };
      }
    }
    return Object.assign({}, pTransition, lAdditionalAttributes);
  };
}

module.exports = { escapeTransitionStrings, addPorts };
