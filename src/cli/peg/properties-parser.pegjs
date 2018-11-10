properties =
  namevaluepair+

namevaluepair "name value pair"
  = _ name:unquotedstring _ "=" _ value:val _ {return {name, value}}

val "valid value"
  = number / boolean/ string

string "a quoted or unquoted string"
  = quotedstring
  / unquotedstring

quotedstring "double quoted string"
  = '"' s:quotedstringcontent '"' {return s.join("")}

quotedstringcontent
  = (!'"' c:('\\"'/ .) {return c})+

unquotedstring
  = s:unquotedstringcontent {return text()}

unquotedstringcontent
  = (!(' '/ '='/ '\t'/ '\n'/ '\r') c:(.) {return c})+

boolean "boolean"
  = bool:("true" / "false") {return (bool==="true")}

integer "integer"
  = [0-9]+ { return parseInt(text(), 10); }

number "number"
  = integer ("." integer)? {return parseFloat(text())}

_ "whitespace"
  = [ \t\n\r]*
