function isType(pType) {
  return pState => pState.type === pType;
}

function isTransitionTo(pTo) {
  return pTransition => pTransition.to === pTo;
}

function isTransitionFrom(pFrom) {
  return pTransition => pTransition.from === pFrom;
}

// duplicate from scxml/index.js = > better put in a central spot
function formatLabel(pEvent, pCond, pActions) {
  let lRetval = "";
  if (pEvent) {
    lRetval += pEvent;
  }
  if (pCond) {
    lRetval += ` [${pCond}]`;
  }
  if (pActions) {
    lRetval += `/ ${pActions}`;
  }
  return lRetval.trim();
}

module.exports = {
  isType,
  isTransitionTo,
  isTransitionFrom,
  formatLabel
};
