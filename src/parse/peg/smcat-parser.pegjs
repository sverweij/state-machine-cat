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
        parserHelpers.setIf(lStateMachine, 'states', states);
        parserHelpers.setIfNotEmpty(lStateMachine, 'transitions', transitions);

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
       _ id:identifier
       _ extendedAttributes:("[" attrs:extendedattributes "]" {return attrs})?
       _ actions:(":" _ act:string _ {return act})?
       _ statemachine:("{" _ sm:statemachine _ "}" {return sm;})?
       _
        {
          let lState = parserHelpers.initState(id);
          (extendedAttributes || []).forEach(
            pExtendedAttribute => parserHelpers.setIf(lState, pExtendedAttribute.name, pExtendedAttribute.value)
          );
          
          parserHelpers.setIf(lState, 'statemachine', statemachine);
          parserHelpers.setIfNotEmpty(lState, 'note', notes);

          if (Boolean(actions)) {
            parserHelpers.setIfNotEmpty(
                lState,
                'actions',
                parserHelpers.extractActions(actions)
            );
          }

          return lState;
        }

extendedattributes "extended attributes"
    = attributes:(extendedattribute)*

extendedattribute "extended attribute"
    = _ name:extendedattributename _ "=" _ value:quotedstring _
    {
        return {name, value};
    }

extendedattributename "attribute name"
    = name:("label"i / "color"i)
    {
        return name.toLowerCase();
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
      parserHelpers.setIfNotEmpty(trans, 'note', notes);

      return trans;
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
    = (chars:([^;, \"\t\n\r=\-><:\{\[])+ {return chars.join("")})
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
