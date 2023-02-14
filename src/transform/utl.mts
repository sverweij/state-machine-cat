function formatLabel(
  pEvent?: string,
  pCond?: string,
  pActions?: string
): string {
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
