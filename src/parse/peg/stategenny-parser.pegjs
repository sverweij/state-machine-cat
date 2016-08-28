/*
 * parser for TBD
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
        if (pName === undefined || pName === "*") {
            return true;
        }
        if (pStates.states.some(function(pState){
            return pState.name === pName;
        })){
            return true;
        }
        return pStateNamesToIgnore[pName] === true;
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
        if (!pStates) {
            pStates = {};
            pStates.states = [];
        }

        if (!pStateNamesToIgnore){
            pStateNamesToIgnore = {};
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

}

program
    =  pre:_ d:declarationlist _
    {
        d[0] = extractUndeclaredStates(d[0], d[1]);
        var lRetval = merge (d[0], d[1]);

        if (pre.length > 0) {
            lRetval = merge({precomment: pre}, lRetval);
        }
        return lRetval;
    }

declarationlist
    = (s:statelist {return {states:s}})?
      (t:transitionlist {return {transitions:t}})?

statelist
    = sl:((s:state "," note:note? {if (note) { s.note = note } return s})*
          (s:state ";" note:note? {if (note) { s.note = note } return s})
      )
    {
      sl[0].push(sl[1]);
      return sl[0];
    }

state "state"
    =  _ name:identifier _ activities:(":" _ l:string _ {return l})?
    {
      var lState = initState(name);
      if (Boolean(activities)) {
        lState.activities = activities;
      }
      return lState;
    }

transitionlist
    = (t:transition {return t})+

transition
    = ra:(bt:transitionthing {return bt})
      label:(":" _ s:transitionstring _ {return s})?
      ";"
      note:note?

    {
      if (label) { ra.label = label; }
      if (note) { ra.note = note; }
      return ra;
    }

transitionthing
    = (_ from:identifier _ fwdarrowtoken _ to:identifier _
      {return {from:from, to:to}})
    /(_ to:identifier _ bckarrowtoken _ from:identifier _
      {return {from:from, to:to}})
    /(_ "*" _ bckarrowtoken _ from:identifier _
      {return {from: from, to:"*"}})
    /(_ from:identifier _ fwdarrowtoken _ "*" _
      {return {from: from, to: "*"}})

fwdarrowtoken "left to right arrow"
    = "->"
    / "=>>"
    / "=>"
    / ">>"
    / ":>"

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
    = (chars:([^;, \"\t\n\r=\-><:\{\*])+ {return chars.join("")})
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
