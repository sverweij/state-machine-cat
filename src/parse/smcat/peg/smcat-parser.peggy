/*
 * parser for smcat
 *
 */

program
    =  _ statemachine:statemachine _
    {
        statemachine.states = parserHelpers.extractUndeclaredStates(statemachine);
        return parserHelpers.classifyForkJoins(statemachine);
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
       _ extended_state_attributes:("[" attrs:extended_state_attributes "]" {return attrs})?
       _ actions:(":" _ act:string _ {return act})?
       _ statemachine:("{" _ sm:statemachine _ "}" {return sm;})?
       _
        {
          let lState = parserHelpers.initState(id);
          (extended_state_attributes || []).forEach(
            pExtendedAttribute => parserHelpers.setIf(lState, pExtendedAttribute.name, pExtendedAttribute.value)
          );
          parserHelpers.setIf(lState, 'typeExplicitlySet', (extended_state_attributes || []).some(pExtendedAttribute => pExtendedAttribute.typeExplicitlySet));
          parserHelpers.setIf(lState, 'statemachine', statemachine);
          parserHelpers.setIfNotEmpty(lState, 'note', notes);

          if (actions) {
            parserHelpers.setIfNotEmpty(
                lState,
                'actions',
                parserHelpers.extractActions(actions)
            );
          }

          return lState;
        }

extended_state_attributes "extended state attributes"
    = attributes:(extended_state_attribute)*

extended_state_attribute "extended state attribute"
    = _ name:extended_state_string_attribute_name _ "=" _ value:quotedstring _
    {
        return {name, value};
    }
    / _ name:class_attribute_name _ "=" _ value:class_string _
    {
        return {name, value}
    }
    / _ name:extended_state_boolean_attribute_name _
    {
        return {name, value:true}
    }
    / _ name:extended_state_type_attribute_name _ "=" _ value:extended_state_type_attribute_type _
    {
        return {name, value, typeExplicitlySet:true}
    }

extended_state_string_attribute_name "state attribute name"
    = name:("label"i / "color"i)
    {
        return name.toLowerCase();
    }

class_attribute_name "class attribute"
    = name:("class"i)
    {
        return name.toLowerCase();
    }

extended_state_boolean_attribute_name "state flag"
    = name:("active"i)
    {
        return name.toLowerCase();
    }

extended_state_type_attribute_name "state type"
    = name:("type"i)
    {
        return name.toLowerCase();
    }

extended_state_type_attribute_type "state type type"
    = "regular"
    / "initial"
    / "terminate"
    / "final"
    / "parallel"
    / "history"
    / "deephistory"
    / "choice"
    / "forkjoin"
    / "fork"
    / "join"
    / "junction"

transition "transition"
    = notes:note*
      trans:transitionbase
      extended_attributes:("[" attrs:extended_transition_attributes "]" _ {return attrs})?
      label:(":" _ lbl:transitionstring _ {return lbl})?
      ";"
    {
      if (label) {
          trans.label = label;
          trans = Object.assign(
              trans,
              parserHelpers.parseTransitionExpression(label),
          );
      }
      (extended_attributes || []).forEach(
          pExtendedAttribute => parserHelpers.setIf(trans, pExtendedAttribute.name, pExtendedAttribute.value)
      );
      parserHelpers.setIfNotEmpty(trans, 'note', notes);

      trans.id=options.counter.next();
      return trans;
    }

// using from_ instead of just 'from' as label name because for #reasons peggy
// doesn't allow labels that are also JavaScript keywords
transitionbase
    = (_ from_:identifier _ fwdarrowtoken _ to:identifier _
          {
              return {
                  from: from_,
                  to: to
              }
          }
    )

    / (_ to:identifier _ bckarrowtoken _ from_:identifier _
      {
          return {
              from: from_,
              to: to
          }
      }
    )

extended_transition_attributes "extended transition attributes"
    = attributes:(extended_transition_attribute)*

extended_transition_attribute "extended transition attribute"
    = _ name:extended_transition_string_attribute_name _ "=" _ value:quotedstring _
    {
        return {name, value};
    }
    / _ name:class_attribute_name _ "=" _ value:class_string _
    {
        return {name, value};
    }
    / _ name:(extended_transition_type_name) _ "=" _ value:extended_transition_type_value _
    {
        return {name, value};
    }
    / _ name:(extended_transition_numeric_attribute_name) _ "=" _ value:positive_number _
    {
        return {name, value};
    }

extended_transition_string_attribute_name "transition attribute name"
    = name:("color"i)
    {
        return name.toLowerCase();
    }

extended_transition_type_name "transition type name"
    = name:("type"i)
    {
        return name.toLowerCase();
    }

extended_transition_numeric_attribute_name "numeric transition attribute name"
    = name:("width"i)
    {
        return name
    }

extended_transition_type_value "transition type value"
    = "external"
    / "internal"

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
positive_number
    = positive_real
    / cardinal

positive_real
    = digits:(cardinal "." cardinal) { return parseFloat(digits.join("")); }

cardinal
    = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

transitionstring
    = quotedstring
    / unquotedtransitionstring

string
    = quotedstring
    / unquotedstring

quotedstring "double quoted string"
    = '"' s:stringcontent '"' {return s.join("").replace(/\\\"/g, "\"")}

stringcontent
    = (!'"' c:('\\"'/ .) {return c})*

class_string "valid class string"
    = '"' s:class_stringcontent '"' {return s.join("")}

class_stringcontent
    = (!'"' c:([a-zA-Z0-9_\- ]) {return c})*

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
    = c:[ \t]

lineend "line end"
    = c:[\r\n]

/* comments - multi line */
mlcomstart = "/*"
mlcomend   = "*/"
mlcomtok   = !"*/" c:.
mlcomment
    = start:mlcomstart com:(mlcomtok)* end:mlcomend

/* comments - single line */
slcomstart = "//"
slcomtok   = [^\r\n]
slcomment
    = start:(slcomstart) com:(slcomtok)*

/* comments in general */
comment "comment"
    = slcomment
    / mlcomment
_
   = (whitespace / lineend/ comment)*
