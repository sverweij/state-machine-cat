/*
 * parser for smcat
 *
 */

{
    const parserHelpers = require('./parserHelpers');
}

program
    =  _ statemachine:statemachine _
    {
        statemachine.states = parserHelpers.extractUndeclaredStates(statemachine);
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
      return parserHelpers.uniq(states[0].concat(states[1]), parserHelpers.stateEqual);
    }

state "state"
    =  notes:note*
       _ name:identifier
       _ activities:(":" _ act:string _ {return act})?
       _ statemachine:("{" _ sm:statemachine _ "}" {return sm;})?
       _
        {
          let lState = parserHelpers.initState(name);

          if (Boolean(statemachine)) {
            lState.statemachine = statemachine;
          }

          if (Boolean(activities)) {
            lState.activities = activities;
            lState = Object.assign(
                lState,
                parserHelpers.parseStateActivities(activities)
            )
          }

          return parserHelpers.joinNotes(notes, lState);
        }

transition "transition"
    = notes:note*
      trans:transitionbase
      label:(":" _ lbl:transitionstring _ {return lbl})?
      ";"
    {
      if (label) {
          trans.label = label;
          trans = Object.assign(
              trans,
              parserHelpers.parseTransitionExpression(label)
          );
      }
      return parserHelpers.joinNotes(notes, trans);
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
