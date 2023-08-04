import { castArray } from "./utl.mjs";
function normalizeInitialFromObject(pInitialObject, pId) {
    const lReturnValue = {
        id: pId ? `${pId}.initial` : "initial",
    };
    if (pInitialObject.transition) {
        Object.assign(lReturnValue, {
            transition: [pInitialObject.transition],
        });
    }
    return lReturnValue;
}
function normalizeInitialFromString(pString) {
    return {
        id: "initial",
        transition: [
            {
                target: pString,
            },
        ],
    };
}
function normalizeInitial(pMachine) {
    const lReturnValue = [];
    if (pMachine.initial) {
        if (typeof pMachine.initial === "string") {
            lReturnValue.push(normalizeInitialFromString(pMachine.initial));
        }
        else {
            lReturnValue.push(normalizeInitialFromObject(pMachine.initial, pMachine.id));
        }
    }
    return lReturnValue;
}
export function normalizeMachine(pMachine) {
    return {
        ...pMachine,
        initial: normalizeInitial(pMachine),
        state: castArray(pMachine?.state ?? []),
        parallel: castArray(pMachine?.parallel ?? []),
        history: castArray(pMachine?.history ?? []),
        final: castArray(pMachine?.final ?? []),
    };
}
