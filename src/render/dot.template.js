/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(['../lib/handlebars.runtime'], function(Handlebars) {
  Handlebars = Handlebars["default"];  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
return templates['dot.template.hbs'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=helpers.blockHelperMissing, buffer = "";

  stack1 = ((helper = (helper = helpers.noteName || (depth0 != null ? depth0.noteName : depth0)) != null ? helper : alias2),(options={"name":"noteName","hash":{},"fn":container.noop,"inverse":container.program(2, data, 0, blockParams, depths),"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.noteName) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.noteName || (depth0 != null ? depth0.noteName : depth0)) != null ? helper : alias2),(options={"name":"noteName","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.noteName) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=helpers.blockHelperMissing, buffer = 
  "    \""
    + ((stack1 = ((helper = (helper = helpers.from || (depth0 != null ? depth0.from : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"from","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" -> \""
    + ((stack1 = ((helper = (helper = helpers.to || (depth0 != null ? depth0.to : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"to","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" [label=\"";
  stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(options={"name":"label","hash":{},"fn":container.noop,"inverse":container.program(3, data, 0),"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.label) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"";
  stack1 = ((helper = (helper = helpers.fromComposite || (depth0 != null ? depth0.fromComposite : depth0)) != null ? helper : alias2),(options={"name":"fromComposite","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.fromComposite) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.toComposite || (depth0 != null ? depth0.toComposite : depth0)) != null ? helper : alias2),(options={"name":"toComposite","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.toComposite) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "]\n";
},"3":function(container,depth0,helpers,partials,data) {
    return " ";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return " ltail=\"cluster_"
    + ((stack1 = ((helper = (helper = helpers.from || (depth0 != null ? depth0.from : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"from","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return " lhead=\"cluster_"
    + ((stack1 = ((helper = (helper = helpers.to || (depth0 != null ? depth0.to : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"to","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"";
},"9":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=helpers.blockHelperMissing;

  return "      \"i_"
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "\" [shape=point style=invis margin=0 width=0 height=0]\n      \""
    + ((stack1 = alias1((depths[1] != null ? depths[1].from : depths[1]), depth0)) != null ? stack1 : "")
    + "\" -> \"i_"
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "\" [arrowhead=none"
    + ((stack1 = alias2.call(depth0,alias1((depths[1] != null ? depths[1].fromComposite : depths[1]), depth0),{"name":"../fromComposite","hash":{},"fn":container.program(10, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "]\n      \"i_"
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "\" -> \""
    + ((stack1 = alias1((depths[1] != null ? depths[1].to : depths[1]), depth0)) != null ? stack1 : "")
    + "\" [label=\""
    + ((stack1 = alias2.call(depth0,alias1((depths[1] != null ? depths[1].label : depths[1]), depth0),{"name":"../label","hash":{},"fn":container.noop,"inverse":container.program(3, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + ((stack1 = alias1((depths[1] != null ? depths[1].label : depths[1]), depth0)) != null ? stack1 : "")
    + "\""
    + ((stack1 = alias2.call(depth0,alias1((depths[1] != null ? depths[1].toComposite : depths[1]), depth0),{"name":"../toComposite","hash":{},"fn":container.program(12, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "]\n      \"i_"
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "\" -> \""
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "\" [style=dashed arrowtail=none arrowhead=none weight=0]\n      \""
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "\" [label=\""
    + ((stack1 = alias1((depths[1] != null ? depths[1].noteFlattened : depths[1]), depth0)) != null ? stack1 : "")
    + "\" shape=note fontsize=10 fillcolor=\"#ffffcc\" penwidth=1.0]\n";
},"10":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return " ltail=\"cluster_"
    + ((stack1 = container.lambda((depths[1] != null ? depths[1].from : depths[1]), depth0)) != null ? stack1 : "")
    + "\"";
},"12":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return " lhead=\"cluster_"
    + ((stack1 = container.lambda((depths[1] != null ? depths[1].to : depths[1]), depth0)) != null ? stack1 : "")
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, buffer = 
  "digraph \"state transitions\" {\n  splines=true ordering=out compound=true overlap=scale K=0.9 epsilon=0.9 nodesep=0.16\n  fontname=\"Helvetica\" fontsize=12 penwidth=2.0\n  node [shape=Mrecord style=filled fillcolor=white fontname=Helvetica fontsize=12 penwidth=2.0]\n  edge [fontname=Helvetica fontsize=10]\n\n"
    + ((stack1 = container.invokePartial(partials["dot.states.template.hbs"],depth0,{"name":"dot.states.template.hbs","data":data,"indent":"  ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n";
  stack1 = ((helper = (helper = helpers.transitions || (depth0 != null ? depth0.transitions : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"transitions","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.transitions) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "}\n";
},"usePartial":true,"useData":true,"useDepths":true});
});