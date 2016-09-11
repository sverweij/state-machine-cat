/*
 * parser for stategenny
 *
 */

{
    function merge(pBase, pObjectToMerge){
        pBase = pBase || {};
        if (pObjectToMerge){
            Object.getOwnPropertyNames(pObjectToMerge).forEach(function(pAttribute){
                pBase[pAttribute] = pObjectToMerge[pAttribute];
            });
        }
        return pBase;
    }

    function stateExists (pStates, pName, pStateNamesToIgnore) {
        return (pName === undefined) ||
            pStates.states.map(pluck("name")).some(eq(pName)) ||
            pStateNamesToIgnore.some(eq(pName));
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

    function extractUndeclaredStates (pStates, pTransitionList, pStateNamesToIgnore) {
        if (!Boolean(pStates)) {
            pStates = {};
            pStates.states = [];
        }

        if (!Boolean(pStateNamesToIgnore)){
            pStateNamesToIgnore = [];
        }

        if (Boolean(pTransitionList)) {
            pTransitionList.transitions.forEach(function(pTransition){
                if (!stateExists (pStates, pTransition.from, pStateNamesToIgnore)) {
                    pStates.states[pStates.states.length] =
                        initState(pTransition.from);
                }
                if (!stateExists (pStates, pTransition.to, pStateNamesToIgnore)) {
                    pStates.states[pStates.states.length] =
                        initState(pTransition.to);
                }
            })
        }
        return pStates;
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

    function doMagic(pStateMachine, pAlreadyDeclaredStates) {
        pStateMachine
            .states
            .filter(isType("composite"))
            .forEach(function(pState){
                pState.statemachine = merge (
                    extractUndeclaredStates(
                        pState.statemachine[0],
                        pState.statemachine[1],
                        pAlreadyDeclaredStates
                    ),
                    pState.statemachine[1]
                );
                doMagic(
                    pState.statemachine,
                    pAlreadyDeclaredStates.concat(
                        pState.statemachine.states.map(
                            pluck("name")
                        )
                    )
                );
            });
    }
}

program
    =  _ statemachine:statemachine _
    {
        var lStateMachine = merge (
            extractUndeclaredStates(statemachine[0], statemachine[1]),
            statemachine[1]
        );
        doMagic(lStateMachine, lStateMachine.states.map(pluck("name")));
        return lStateMachine;
    }

statemachine "statemachine"
    = (s:states      {return {states:s}})?
      (t:transition+ {return {transitions:t}})?

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
      if (label) { trans.label = label; }
      return joinNotes(notes, trans);
    }

transitionbase
    = (_ from:identifier _ fwdarrowtoken _ to:identifier _
      {return {from: from, to: to, type: "regular"}})

    /(_ to:identifier _ bckarrowtoken _ from:identifier _
      {return {from: from, to: to, type: "regular"}})


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
