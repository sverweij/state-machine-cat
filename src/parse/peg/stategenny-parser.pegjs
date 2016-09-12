/*
 * parser for stategenny
 *
 */

{
    function stateExists (pKnownStateNames, pName) {
        return pKnownStateNames.some(eq(pName));
    }

    function initState(pName) {
        var lState = {};
        lState.name = pName;
        lState.type = getStateType(pName);
        return lState;
    }

    function getStateType(pName) {
        switch (pName) {
        case "initial":
            return "initial";
        case "final":
            return "final";
        default:
            return "regular";
        }
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

    function stateEqual(pStateOne) {
        return function(pStateTwo) {
            return pStateOne.name === pStateTwo.name;
        }
    }

    function eq(pOne) {
        return function (pTwo) {
            return pOne === pTwo;
        }
    }

    function uniq(pArray, pEqualFn) {
        return pArray
                .reduce(
                    function(pBag, pMarble){
                        var lMarbleIndex = pBag.findIndex(pEqualFn(pMarble));
                        if (lMarbleIndex > -1) {
                            pBag[lMarbleIndex] = pMarble;
                            return pBag;
                        } else {
                            return pBag.concat(pMarble)
                        }
                    },
                    []
                );
    }

    function isType(pType) {
        return function(pState){
            return pState.type === pType;
        }
    }

    function pluck(pAttribute){
        return function(pObject){
            return pObject[pAttribute];
        }
    }

    function getAlreadyDeclaredStates(pStateMachine) {
        var lRetval = [];

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
        var lStateMachine = {};
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
       _ statemachine:("{" _ s:statemachine _ "}" {return s;})?
       _
        {
          var lState  = initState(name);

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
 This file is part of stategenny.

 stategenny is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 stategenny is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with stategenny.  If not, see <http://www.gnu.org/licenses/>.
 */
