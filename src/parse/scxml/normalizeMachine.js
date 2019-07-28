const _get = require('lodash.get');
const arrayify = require('./utl').arrayify;


function normalizeInitialFromObject(pMachine) {
    const lRetval = {
        id: "initial"
    };
    if (pMachine.initial.transition) {
        Object.assign(
            lRetval,
            {
                transition: [
                    pMachine.initial.transition
                ]
            }

        );
    }

    return lRetval;
}

function normalizeInitialFromString(pMachine) {
    return {
        id: "initial",
        transition: [
            {
                target: pMachine.initial
            }
        ]
    };
}

function normalizeInitial(pMachine) {
    const lRetval = [];
    let lInitialObject = {};

    if (pMachine.initial) {
        if (pMachine.initial.id) {
            lInitialObject = normalizeInitialFromObject(pMachine);

        } else {
            lInitialObject = normalizeInitialFromString(pMachine);
        }
        lRetval.push(lInitialObject);
    }
    return lRetval;
}

module.exports = function normalizeMachine(pMachine) {
    return Object.assign(
        {},
        pMachine,
        {
            initial: normalizeInitial(pMachine),
            state: arrayify(_get(pMachine, "state", [])),
            parallel: arrayify(_get(pMachine, "parallel", [])),
            history: arrayify(_get(pMachine, "history", [])),
            final: arrayify(_get(pMachine, "final", []))
        }
    );
};
