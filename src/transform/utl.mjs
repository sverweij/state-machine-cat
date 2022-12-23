// @ts-check
/**
 *
 * @param {string} [pEvent]
 * @param {string} [pCond]
 * @param {string} [pActions]
 * @returns {string}
 */
function formatLabel(pEvent, pCond, pActions) {
  let lReturnValue = "";

  if (pEvent) {
    lReturnValue += pEvent;
  }
  if (pCond) {
    lReturnValue += ` [${pCond}]`;
  }
  if (pActions) {
    lReturnValue += `/ ${pActions}`;
  }
  return lReturnValue.trim();
}

export default {
  formatLabel,
};
