var Handlebars = require("handlebars/dist/handlebars.runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['dot.states.template.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "  \""
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":2,"column":3},"end":{"line":2,"column":13}}}) : helper))) != null ? stack1 : "")
    + "\" [shape=circle style=filled "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.color : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data,"loc":{"start":{"line":2,"column":42},"end":{"line":2,"column":130}}})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.active : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":130},"end":{"line":2,"column":164}}})) != null ? stack1 : "")
    + "fixedsize=true height=0.15 label=\"\"]\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function";

  return "color=\""
    + ((stack1 = ((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color","hash":{},"data":data,"loc":{"start":{"line":2,"column":62},"end":{"line":2,"column":73}}}) : helper))) != null ? stack1 : "")
    + "\" fillcolor=\""
    + ((stack1 = ((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color","hash":{},"data":data,"loc":{"start":{"line":2,"column":86},"end":{"line":2,"column":97}}}) : helper))) != null ? stack1 : "")
    + "\" ";
},"4":function(container,depth0,helpers,partials,data) {
    return "fillcolor=black ";
},"6":function(container,depth0,helpers,partials,data) {
    return "penwidth=3.0 ";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", buffer = 
  "  \""
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":5,"column":3},"end":{"line":5,"column":13}}}) : helper))) != null ? stack1 : "")
    + "\" [margin=0 "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.color : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":25},"end":{"line":5,"column":65}}})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.active : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":65},"end":{"line":5,"column":114}}})) != null ? stack1 : "")
    + "label= < \n    <table align=\"center\" cellborder=\"0\" border=\"2\" style=\"rounded\" width=\"48\">\n      <tr><td width=\"48\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.actions : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.program(15, data, 0),"data":data,"loc":{"start":{"line":7,"column":24},"end":{"line":7,"column":86}}})) != null ? stack1 : "")
    + ">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.active : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.program(19, data, 0),"data":data,"loc":{"start":{"line":7,"column":87},"end":{"line":7,"column":141}}})) != null ? stack1 : "")
    + "</td></tr>\n";
  stack1 = ((helper = (helper = helpers.actions || (depth0 != null ? depth0.actions : depth0)) != null ? helper : alias2),(options={"name":"actions","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":6},"end":{"line":11,"column":18}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.actions) { stack1 = container.hooks.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </table>\n  >]\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "color=\""
    + ((stack1 = ((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"color","hash":{},"data":data,"loc":{"start":{"line":5,"column":45},"end":{"line":5,"column":56}}}) : helper))) != null ? stack1 : "")
    + "\" ";
},"11":function(container,depth0,helpers,partials,data) {
    return "peripheries=1 style=rounded ";
},"13":function(container,depth0,helpers,partials,data) {
    return " cellpadding=\"2\"";
},"15":function(container,depth0,helpers,partials,data) {
    return " cellpadding=\"7\"";
},"17":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<i>"
    + container.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"label","hash":{},"data":data,"loc":{"start":{"line":7,"column":104},"end":{"line":7,"column":113}}}) : helper)))
    + "</i>";
},"19":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"label","hash":{},"data":data,"loc":{"start":{"line":7,"column":125},"end":{"line":7,"column":134}}}) : helper)));
},"21":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(data && data.first),{"name":"if","hash":{},"fn":container.program(22, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":8},"end":{"line":9,"column":34}}})) != null ? stack1 : "")
    + "\n        <tr><td align=\"left\" cellpadding=\"2\">"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</td></tr>\n";
},"22":function(container,depth0,helpers,partials,data) {
    return "<hr/>";
},"24":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "  \""
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":16,"column":3},"end":{"line":16,"column":13}}}) : helper))) != null ? stack1 : "")
    + "\" [shape=circle "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.color : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":16,"column":29},"end":{"line":16,"column":69}}})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.active : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":16,"column":69},"end":{"line":16,"column":103}}})) != null ? stack1 : "")
    + "label=\"H\"]\n";
},"26":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "  \""
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":19,"column":3},"end":{"line":19,"column":13}}}) : helper))) != null ? stack1 : "")
    + "\" [shape=circle "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.color : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":19,"column":29},"end":{"line":19,"column":69}}})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.active : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":19,"column":69},"end":{"line":19,"column":103}}})) != null ? stack1 : "")
    + "label=\"H*\"]\n";
},"28":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.hooks.blockHelperMissing, buffer = 
  "  \""
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":22,"column":3},"end":{"line":22,"column":13}}}) : helper))) != null ? stack1 : "")
    + "\" [shape=diamond fixedsize=true width=0.35 height=0.35 fontsize=10 "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.color : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":22,"column":80},"end":{"line":22,"column":120}}})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.active : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":22,"column":120},"end":{"line":22,"column":154}}})) != null ? stack1 : "")
    + "label=\" \"]\n  \""
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":23,"column":3},"end":{"line":23,"column":13}}}) : helper))) != null ? stack1 : "")
    + "\" -> \""
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":23,"column":19},"end":{"line":23,"column":29}}}) : helper))) != null ? stack1 : "")
    + "\" [label=<";
  stack1 = ((helper = (helper = helpers.actions || (depth0 != null ? depth0.actions : depth0)) != null ? helper : alias2),(options={"name":"actions","hash":{},"fn":container.program(29, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":23,"column":39},"end":{"line":23,"column":144}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.actions) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += "> color=transparent";
  stack1 = ((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : alias2),(options={"name":"color","hash":{},"fn":container.program(38, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":23,"column":163},"end":{"line":23,"column":203}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.color) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "];\n";
},"29":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers["if"].call(alias1,(data && data.first),{"name":"if","hash":{},"fn":container.program(30, data, 0, blockParams, depths),"inverse":container.program(32, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":23,"column":51},"end":{"line":23,"column":82}}})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depths[1] != null ? depths[1].active : depths[1]),{"name":"if","hash":{},"fn":container.program(34, data, 0, blockParams, depths),"inverse":container.program(36, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":23,"column":82},"end":{"line":23,"column":131}}})) != null ? stack1 : "");
},"30":function(container,depth0,helpers,partials,data) {
    return "";
},"32":function(container,depth0,helpers,partials,data) {
    return "\\n";
},"34":function(container,depth0,helpers,partials,data) {
    return "<i>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</i>";
},"36":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression(container.lambda(depth0, depth0));
},"38":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " fontcolor=\""
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
    + "\"";
},"40":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function";

  return "  \""
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":26,"column":3},"end":{"line":26,"column":13}}}) : helper))) != null ? stack1 : "")
    + "\" [shape=rect "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.color : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data,"loc":{"start":{"line":26,"column":27},"end":{"line":26,"column":115}}})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.active : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":26,"column":115},"end":{"line":26,"column":149}}})) != null ? stack1 : "")
    + "label=\" \" fixedsize=true style=filled "
    + ((stack1 = ((helper = (helper = helpers.sizingExtras || (depth0 != null ? depth0.sizingExtras : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"sizingExtras","hash":{},"data":data,"loc":{"start":{"line":26,"column":187},"end":{"line":26,"column":205}}}) : helper))) != null ? stack1 : "")
    + "]\n";
},"42":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function";

  return "  \""
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":32,"column":3},"end":{"line":32,"column":13}}}) : helper))) != null ? stack1 : "")
    + "\" [label= < \n      <table align=\"center\" cellborder=\"0\" border=\"0\">\n        <tr><td cellpadding=\"0\"><font "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.color : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":34,"column":38},"end":{"line":34,"column":78}}})) != null ? stack1 : "")
    + "point-size=\"20\">X</font></td></tr>\n        <tr><td cellpadding=\"0\"><font "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.color : depth0),{"name":"if","hash":{},"fn":container.program(43, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":35,"column":38},"end":{"line":35,"column":77}}})) != null ? stack1 : "")
    + ">"
    + container.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data,"loc":{"start":{"line":35,"column":78},"end":{"line":35,"column":87}}}) : helper)))
    + "</font></td></tr>\n      </table>\n    >]\n";
},"43":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "color=\""
    + ((stack1 = ((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"color","hash":{},"data":data,"loc":{"start":{"line":35,"column":58},"end":{"line":35,"column":69}}}) : helper))) != null ? stack1 : "")
    + "\"";
},"45":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "  \""
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":40,"column":3},"end":{"line":40,"column":13}}}) : helper))) != null ? stack1 : "")
    + "\" [shape=circle style=filled "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.color : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data,"loc":{"start":{"line":40,"column":42},"end":{"line":40,"column":130}}})) != null ? stack1 : "")
    + "fixedsize=true height=0.15 peripheries=2 "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.active : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":40,"column":171},"end":{"line":40,"column":205}}})) != null ? stack1 : "")
    + "label=\"\"]\n";
},"47":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.hooks.blockHelperMissing, buffer = "";

  stack1 = ((helper = (helper = helpers.hasSelfTransitions || (depth0 != null ? depth0.hasSelfTransitions : depth0)) != null ? helper : alias2),(options={"name":"hasSelfTransitions","hash":{},"fn":container.program(48, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":43,"column":2},"end":{"line":45,"column":25}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.hasSelfTransitions) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += "  subgraph \"cluster_"
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":46,"column":20},"end":{"line":46,"column":30}}}) : helper))) != null ? stack1 : "")
    + "\" {\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.color : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":47,"column":4},"end":{"line":47,"column":44}}})) != null ? stack1 : "")
    + "label= <\n    <table cellborder=\"0\" border=\"0\">\n      <tr><td>"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.active : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.program(19, data, 0),"data":data,"loc":{"start":{"line":49,"column":14},"end":{"line":49,"column":68}}})) != null ? stack1 : "")
    + "</td></tr>\n";
  stack1 = ((helper = (helper = helpers.actions || (depth0 != null ? depth0.actions : depth0)) != null ? helper : alias2),(options={"name":"actions","hash":{},"fn":container.program(50, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":50,"column":6},"end":{"line":53,"column":18}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.actions) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </table>\n    > "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.parentIsParallel : depth0),{"name":"if","hash":{},"fn":container.program(52, data, 0),"inverse":container.program(54, data, 0),"data":data,"loc":{"start":{"line":55,"column":6},"end":{"line":55,"column":137}}})) != null ? stack1 : "")
    + "\n    \""
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":56,"column":5},"end":{"line":56,"column":15}}}) : helper))) != null ? stack1 : "")
    + "\" [shape=point style=invis margin=0 width=0 height=0 fixedsize=true]\n    "
    + ((stack1 = (helpers.stateSection||(depth0 && depth0.stateSection)||alias2).call(alias1,(depth0 != null ? depth0.statemachine : depth0),{"name":"stateSection","hash":{},"fn":container.program(30, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":57,"column":4},"end":{"line":57,"column":51}}})) != null ? stack1 : "")
    + "\n  }\n";
},"48":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "  \"self_"
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"name","hash":{},"data":data,"loc":{"start":{"line":44,"column":8},"end":{"line":44,"column":18}}}) : helper))) != null ? stack1 : "")
    + "\" [shape=point style=invis width=0 height=0]\n";
},"50":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(data && data.first),{"name":"if","hash":{},"fn":container.program(22, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":51,"column":8},"end":{"line":51,"column":34}}})) != null ? stack1 : "")
    + "\n        <tr><td align=\"left\">"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</td></tr>\n";
},"52":function(container,depth0,helpers,partials,data) {
    return "style=\"dashed\" penwidth=1";
},"54":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "style=rounded "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.active : depth0),{"name":"if","hash":{},"fn":container.program(55, data, 0),"inverse":container.program(57, data, 0),"data":data,"loc":{"start":{"line":55,"column":77},"end":{"line":55,"column":130}}})) != null ? stack1 : "");
},"55":function(container,depth0,helpers,partials,data) {
    return "penwidth=3.0";
},"57":function(container,depth0,helpers,partials,data) {
    return "penwidth=2.0";
},"59":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, buffer = "";

  stack1 = ((helper = (helper = helpers.noteName || (depth0 != null ? depth0.noteName : depth0)) != null ? helper : container.hooks.helperMissing),(options={"name":"noteName","hash":{},"fn":container.program(60, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":61,"column":4},"end":{"line":64,"column":17}}}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),options) : helper));
  if (!helpers.noteName) { stack1 = container.hooks.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"60":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda;

  return "    \""
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "\" [color=black fontcolor=black label=\""
    + ((stack1 = alias1((depths[1] != null ? depths[1].noteFlattened : depths[1]), depth0)) != null ? stack1 : "")
    + "\" shape=note fontsize=10 fillcolor=\"#ffffcc\" penwidth=1.0]\n    \""
    + ((stack1 = alias1((depths[1] != null ? depths[1].name : depths[1]), depth0)) != null ? stack1 : "")
    + "\" -> \""
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "\" [style=dashed arrowtail=none arrowhead=none]\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.hooks.blockHelperMissing, buffer = "";

  stack1 = ((helper = (helper = helpers.initialStates || (depth0 != null ? depth0.initialStates : depth0)) != null ? helper : alias2),(options={"name":"initialStates","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":3,"column":18}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.initialStates) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.regularStates || (depth0 != null ? depth0.regularStates : depth0)) != null ? helper : alias2),(options={"name":"regularStates","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":0},"end":{"line":14,"column":18}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.regularStates) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.historyStates || (depth0 != null ? depth0.historyStates : depth0)) != null ? helper : alias2),(options={"name":"historyStates","hash":{},"fn":container.program(24, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":0},"end":{"line":17,"column":18}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.historyStates) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.deepHistoryStates || (depth0 != null ? depth0.deepHistoryStates : depth0)) != null ? helper : alias2),(options={"name":"deepHistoryStates","hash":{},"fn":container.program(26, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":18,"column":0},"end":{"line":20,"column":22}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.deepHistoryStates) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.choiceStates || (depth0 != null ? depth0.choiceStates : depth0)) != null ? helper : alias2),(options={"name":"choiceStates","hash":{},"fn":container.program(28, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":21,"column":0},"end":{"line":24,"column":17}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.choiceStates) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.forkjoinStates || (depth0 != null ? depth0.forkjoinStates : depth0)) != null ? helper : alias2),(options={"name":"forkjoinStates","hash":{},"fn":container.program(40, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":25,"column":0},"end":{"line":27,"column":19}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.forkjoinStates) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.junctionStates || (depth0 != null ? depth0.junctionStates : depth0)) != null ? helper : alias2),(options={"name":"junctionStates","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":28,"column":0},"end":{"line":30,"column":19}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.junctionStates) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.terminateStates || (depth0 != null ? depth0.terminateStates : depth0)) != null ? helper : alias2),(options={"name":"terminateStates","hash":{},"fn":container.program(42, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":31,"column":0},"end":{"line":38,"column":20}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.terminateStates) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.finalStates || (depth0 != null ? depth0.finalStates : depth0)) != null ? helper : alias2),(options={"name":"finalStates","hash":{},"fn":container.program(45, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":39,"column":0},"end":{"line":41,"column":16}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.finalStates) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.compositeStates || (depth0 != null ? depth0.compositeStates : depth0)) != null ? helper : alias2),(options={"name":"compositeStates","hash":{},"fn":container.program(47, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":42,"column":0},"end":{"line":59,"column":20}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.compositeStates) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.states || (depth0 != null ? depth0.states : depth0)) != null ? helper : alias2),(options={"name":"states","hash":{},"fn":container.program(59, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":60,"column":0},"end":{"line":65,"column":11}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.states) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true,"useDepths":true});
