/*
 * parser for smcat
 *
 */

{
    const CHOICE_RE   = /^\^.*/;
    const FORKJOIN_RE = /^].*/;
    const HISTORY_RE  = /history/;
    const INITIAL_RE  = /initial/;
    const FINAL_RE    = /final/;

    function stateExists (pKnownStateNames, pName) {
        return pKnownStateNames.some(pKnownStateName => pKnownStateName === pName);
    }

    function initState(pName) {
        return {
            name: pName,
            type: getStateType(pName)
        };
    }

    function getStateType(pName) {
        if (INITIAL_RE.test(pName)){
            return "initial";
        }
        if (FINAL_RE.test(pName)){
            return "final";
        }
        if (HISTORY_RE.test(pName)){
            return "history";
        }
        if (CHOICE_RE.test(pName)){
            return "choice";
        }
        if (FORKJOIN_RE.test(pName)){
            return "forkjoin";
        }
        return "regular";
    }

    function extractUndeclaredStates (pStateMachine, pKnownStateNames) {
        pKnownStateNames = pKnownStateNames
                         ? pKnownStateNames
                         : getAlreadyDeclaredStates(pStateMachine);

        if (pStateMachine.hasOwnProperty("states")) {
            pStateMachine
                .states
                .filter(isType("composite"))
                .forEach(function(pState){
                    pState.statemachine.states =
                        extractUndeclaredStates(
                            pState.statemachine,
                            pKnownStateNames
                        );
                })
        } else {
            pStateMachine.states = [];
        }

        if (pStateMachine.hasOwnProperty("transitions")) {
            pStateMachine.transitions.forEach(function(pTransition){
                if (!stateExists (pKnownStateNames, pTransition.from)) {
                    pKnownStateNames.push(pTransition.from);
                    pStateMachine.states.push(initState(pTransition.from));
                }
                if (!stateExists (pKnownStateNames, pTransition.to)) {
                    pKnownStateNames.push(pTransition.to);
                    pStateMachine.states.push(initState(pTransition.to));
                }
            })
        }
        return pStateMachine.states;
    }

    function joinNotes(pNotes, pThing) {
        if (pNotes && pNotes.length > 0) {
            pThing.note = pNotes;
        }
        return pThing;
    }

    function stateEqual(pStateOne, pStateTwo) {
        return pStateOne.name === pStateTwo.name;
    }

    function uniq(pArray, pEqualFn) {
        return pArray
                .reduce(
                    (pBag, pMarble) => {
                        const lMarbleIndex = pBag.findIndex((pBagItem) => pEqualFn(pBagItem, pMarble));

                        if (lMarbleIndex > -1) {
                            pBag[lMarbleIndex] = pMarble; // ensures the _last_ marble we find is in the bag on that position
                            return pBag;
                        } else {
                            return pBag.concat(pMarble)
                        }
                    },
                    []
                );
    }

    function isType(pType) {
        return (pState) => pState.type === pType;
    }

    function pluck(pAttribute){
        return (pObject) => pObject[pAttribute];
    }

    function getAlreadyDeclaredStates(pStateMachine) {
        let lRetval = [];

        if (pStateMachine.hasOwnProperty("states")) {
            lRetval = pStateMachine.states.map(pluck("name"));
            pStateMachine
                .states
                .filter(isType("composite"))
                .forEach(function(pState){
                    lRetval = lRetval.concat(
                        getAlreadyDeclaredStates(pState.statemachine)
                    );
                });
        }
        return lRetval;
    }

    function parseTransitionExpression(pString) {
        const TRANSITION_EXPRESSION = /([^\[\/]+)?(\[[^\]]+\])?[^\/]*(\/.+)?/;
        let lRetval = {};
        const lMatchResult = pString.match(TRANSITION_EXPRESSION);

        if (lMatchResult){
            if(lMatchResult[1]){
                lRetval.event = lMatchResult[1].trim();
            }
            if(lMatchResult[2]){
                lRetval.cond = lMatchResult[2].substr(1,lMatchResult[2].length-2).trim();
            }
            if(lMatchResult[3]){
                lRetval.action = lMatchResult[3].substr(1,lMatchResult[3].length-1).trim();
            }
        }

        return lRetval;
    }
}

program
    =  _ statemachine:statemachine _
    {
        statemachine.states = extractUndeclaredStates(statemachine);
        return statemachine;
    }

statemachine "statemachine"
    = states:states?
      transitions:transition*
      {
        let lStateMachine = {};
        if (states) {
            lStateMachine.states = states;
        }
        if (transitions && transitions.length > 0) {
            lStateMachine.transitions = transitions;
        }
        return lStateMachine;
      }

states
    = states:((state:state "," {return state})*
              (state:state ";" {return state})
      )
    {
      return uniq(states[0].concat(states[1]), stateEqual);
    }

state "state"
    =  notes:note*
       _ name:identifier
       _ activities:(":" _ l:string _ {return l})?
        // onentry
        // onexit
       _ statemachine:("{" _ s:statemachine _ "}" {return s;})?
       _
        {
          let lState = initState(name);

          if (Boolean(statemachine)) {
            lState.type = "composite";
            lState.statemachine = statemachine;
          }

          if (Boolean(activities)) {
            lState.activities = activities;
          }

          return joinNotes(notes, lState);
        }

transition "transition"
    = notes:note*
      trans:transitionbase
      label:(":" _ s:transitionstring _ {return s})?
      ";"
    {
      if (label) {
          trans.label = label;
          trans = Object.assign(
              trans,
              parseTransitionExpression(label)
          );
      }
      return joinNotes(notes, trans);
    }

transitionbase
    = (_ from:identifier _ fwdarrowtoken _ to:identifier _
          {
              return {
                  from: from,
                  to: to
              }
          }
    )

    / (_ to:identifier _ bckarrowtoken _ from:identifier _
      {
          return {
              from: from,
              to: to
          }
      }
    )


fwdarrowtoken "left to right arrow"
    = "->"
    / "=>>"
    / "=>"
    / ">>"
    / ":>"
    / "--"
    / "=="

bckarrowtoken "right to left arrow"
    = "<-"
    / "<<="
    / "<="
    / "<<"
    / "<:"

note
    = _ "#" com:(slcomtok)*
    {
      return com.join("").trim()
    }

/*  data types */
transitionstring
    = quotedstring
    / unquotedtransitionstring

string
    = quotedstring
    / unquotedstring

quotedstring "double quoted string"
    = '"' s:stringcontent '"' {return s.join("")}

stringcontent
    = (!'"' c:('\\"'/ .) {return c})*

unquotedtransitionstring
    = s:transitionnonsep {return s.join("").trim()}

unquotedstring
    = s:nonsep {return s.join("").trim()}

nonsep
    = (!(','/ ';' /'{') c:(.) {return c})*

transitionnonsep
    = (!(';' /'{') c:(.) {return c})*

identifier "identifier"
    = (chars:([^;, \"\t\n\r=\-><:\{])+ {return chars.join("")})
    / quotedstring

whitespace "whitespace"
    = c:[ \t] {return c}

lineend "line end"
    = c:[\r\n] {return c}

/* comments - multi line */
mlcomstart = "/*"
mlcomend   = "*/"
mlcomtok   = !"*/" c:. {return c}
mlcomment
    = start:mlcomstart com:(mlcomtok)* end:mlcomend
    {
      return start + com.join("") + end
    }

/* comments - single line */
slcomstart = "//"
slcomtok   = [^\r\n]
slcomment
    = start:(slcomstart) com:(slcomtok)*
    {
      return start + com.join("")
    }

/* comments in general */
comment "comment"
    = slcomment
    / mlcomment
_
   = (whitespace / lineend/ comment)*

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
