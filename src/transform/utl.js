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
  formatLabel
};
