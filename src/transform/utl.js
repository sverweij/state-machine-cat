function isType(pType) {
  return pState => pState.type === pType;
}

function isTransitionTo(pTo) {
  return pTransition => pTransition.to === pTo;
}

function isTransitionFrom(pFrom) {
  return pTransition => pTransition.from === pFrom;
}

module.exports = {
  isType,
  isTransitionTo,
  isTransitionFrom
};
