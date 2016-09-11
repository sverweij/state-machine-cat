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
  stack1 = ((helper = (helper = helpers.noteName || (depth0 != null ? depth0.noteName : depth0)) != null ? helper : alias2),(options={"name":"noteName","hash":{},"fn":container.program(5, data, 0, blockParams, depths),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.noteName) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, buffer = 
  "    \""
    + alias4(((helper = (helper = helpers.from || (depth0 != null ? depth0.from : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"from","hash":{},"data":data}) : helper)))
    + "\" -- \""
    + alias4(((helper = (helper = helpers.to || (depth0 != null ? depth0.to : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"to","hash":{},"data":data}) : helper)))
    + "\" ";
  stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(options={"name":"label","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.label) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "[label=\""
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "\"]";
},"5":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "      \"i_"
    + alias2(alias1(depth0, depth0))
    + "\" [shape=point style=invis margin=0 width=0 height=0]\n      \""
    + alias2(alias1((depths[1] != null ? depths[1].from : depths[1]), depth0))
    + "\" -- \"i_"
    + alias2(alias1(depth0, depth0))
    + "\" [arrowhead=none]\n      \"i_"
    + alias2(alias1(depth0, depth0))
    + "\" -- \""
    + alias2(alias1((depths[1] != null ? depths[1].to : depths[1]), depth0))
    + "\" "
    + ((stack1 = helpers.blockHelperMissing.call(depth0,alias1((depths[1] != null ? depths[1].label : depths[1]), depth0),{"name":"../label","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n      \"i_"
    + alias2(alias1(depth0, depth0))
    + "\" -- \""
    + alias2(alias1(depth0, depth0))
    + "\" [style=dashed arrowtail=none arrowhead=none weight=0]\n      \""
    + alias2(alias1(depth0, depth0))
    + "\" [label=\""
    + alias2(alias1((depths[1] != null ? depths[1].noteFlattened : depths[1]), depth0))
    + "\" shape=note fontsize=10 fillcolor=\"#ffffcc\" penwidth=1.0]\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, buffer = 
  "graph \"state transitions\" {\n  splines=true ordering=out compound=true overlap=true\n  fontname=\"Helvetica\" fontsize=12 penwidth=2.0\n  node [shape=Mrecord style=filled fillcolor=white fontname=Helvetica fontsize=12 penwidth=2.0]\n  edge [fontname=Helvetica fontsize=10 arrowhead=normal dir=forward]\n\n"
    + ((stack1 = container.invokePartial(partials["dot.states.template.hbs"],depth0,{"name":"dot.states.template.hbs","data":data,"indent":"  ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n";
  stack1 = ((helper = (helper = helpers.transitions || (depth0 != null ? depth0.transitions : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"transitions","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.transitions) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "}\n";
},"usePartial":true,"useData":true,"useDepths":true});
});