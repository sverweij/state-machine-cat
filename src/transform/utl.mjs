// @ts-check
/**
 *
 * @param {string|undefined} pEvent
 * @param {string|undefined} pCond
 * @param {string|undefined} pActions
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
