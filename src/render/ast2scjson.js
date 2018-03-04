const STATE_TYPE2SCXML_STATE_TYPE = {
    regular: "state"
};

function stateType2SCXMLStateType (pStateType) {
    return STATE_TYPE2SCXML_STATE_TYPE[pStateType] || pStateType;
}

function transformTransition(pTransition){
    const lRetval = {
        target: pTransition.to
    };

    if (Boolean(pTransition.label)){
        lRetval.event = pTransition.label;
    }
    return lRetval;
}

function transformState(pTransitions) {
    return function (pState){
        const lRetval = {
            type: stateType2SCXMLStateType(pState.type),
            id: pState.name
        };

        if (Boolean(pState.activities)){
            lRetval.onentries = lRetval.onentries || [];
            lRetval.onentries.push(pState.activities);
        }

        if (Boolean(pTransitions)){
            lRetval.transitions =
                pTransitions
                    .filter((pTransition) => pTransition.from === pState.name)
                    .map(transformTransition);
        }
        return lRetval;
    };
}

module.exports = {
    render(pAST) {
        return {
            states: pAST.states.map(transformState(pAST.transitions))
        };
    }
};
/*
 This file is part of state-machine-cat.

 smcat is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 smcat is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with smcat.  If not, see <http://www.gnu.org/licenses/>.
 */
