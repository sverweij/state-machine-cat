var Handlebars = require("handlebars/dist/handlebars.runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['dot.template.hbs'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.hooks.blockHelperMissing, buffer = "";

  stack1 = ((helper = (helper = helpers.noteName || (depth0 != null ? depth0.noteName : depth0)) != null ? helper : alias2),(options={"name":"noteName","hash":{},"fn":container.noop,"inverse":container.program(2, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":9,"column":2},"end":{"line":24,"column":15}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.noteName) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.noteName || (depth0 != null ? depth0.noteName : depth0)) != null ? helper : alias2),(options={"name":"noteName","hash":{},"fn":container.program(17, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":25,"column":2},"end":{"line":35,"column":15}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.noteName) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.hooks.blockHelperMissing, buffer = "";

  stack1 = ((helper = (helper = helpers.isCompositeSelf || (depth0 != null ? depth0.isCompositeSelf : depth0)) != null ? helper : alias2),(options={"name":"isCompositeSelf","hash":{},"fn":container.noop,"inverse":container.program(3, data, 0),"data":data,"loc":{"start":{"line":10,"column":4},"end":{"line":15,"column":24}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.isCompositeSelf) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.isCompositeSelf || (depth0 != null ? depth0.isCompositeSelf : depth0)) != null ? helper : alias2),(options={"name":"isCompositeSelf","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":16,"column":4},"end":{"line":23,"column":24}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.isCompositeSelf) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.hooks.blockHelperMissing, buffer = 
  "    \""
    + ((stack1 = ((helper = (helper = helpers.from || (depth0 != null ? depth0.from : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"from","hash":{},"data":data,"loc":{"start":{"line":11,"column":5},"end":{"line":11,"column":15}}}) : helper))) != null ? stack1 : "")
    + "\" -> \""
    + ((stack1 = ((helper = (helper = helpers.to || (depth0 != null ? depth0.to : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"to","hash":{},"data":data,"loc":{"start":{"line":11,"column":21},"end":{"line":11,"column":29}}}) : helper))) != null ? stack1 : "")
    + "\" [label=\"";
  stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(options={"name":"label","hash":{},"fn":container.noop,"inverse":container.program(4, data, 0),"data":data,"loc":{"start":{"line":11,"column":39},"end":{"line":11,"column":60}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.label) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data,"loc":{"start":{"line":11,"column":60},"end":{"line":11,"column":71}}}) : helper))) != null ? stack1 : "")
    + "\"";
  stack1 = ((helper = (helper = helpers.fromComposite || (depth0 != null ? depth0.fromComposite : depth0)) != null ? helper : alias2),(options={"name":"fromComposite","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":28},"end":{"line":12,"column":92}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.fromComposite) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.toComposite || (depth0 != null ? depth0.toComposite : depth0)) != null ? helper : alias2),(options={"name":"toComposite","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":13,"column":28},"end":{"line":13,"column":86}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.toComposite) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : alias2),(options={"name":"color","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":14,"column":28},"end":{"line":14,"column":85}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.color) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "]\n";
},"4":function(container,depth0,helpers,partials,data) {
    return " ";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return " ltail=\"cluster_"
    + ((stack1 = ((helper = (helper = helpers.from || (depth0 != null ? depth0.from : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"from","hash":{},"data":data,"loc":{"start":{"line":12,"column":63},"end":{"line":12,"column":73}}}) : helper))) != null ? stack1 : "")
    + "\"";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return " lhead=\"cluster_"
    + ((stack1 = ((helper = (helper = helpers.to || (depth0 != null ? depth0.to : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"to","hash":{},"data":data,"loc":{"start":{"line":13,"column":61},"end":{"line":13,"column":69}}}) : helper))) != null ? stack1 : "")
    + "\"";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda;

  return " color=\""
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "\" fontcolor=\""
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "\"";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.hooks.blockHelperMissing, buffer = 
  "      \""
    + ((stack1 = ((helper = (helper = helpers.from || (depth0 != null ? depth0.from : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"from","hash":{},"data":data,"loc":{"start":{"line":17,"column":7},"end":{"line":17,"column":17}}}) : helper))) != null ? stack1 : "")
    + "\" -> \"self_"
    + ((stack1 = ((helper = (helper = helpers.from || (depth0 != null ? depth0.from : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"from","hash":{},"data":data,"loc":{"start":{"line":17,"column":28},"end":{"line":17,"column":38}}}) : helper))) != null ? stack1 : "")
    + "\" [label=\"";
  stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(options={"name":"label","hash":{},"fn":container.noop,"inverse":container.program(4, data, 0),"data":data,"loc":{"start":{"line":17,"column":48},"end":{"line":17,"column":69}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.label) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data,"loc":{"start":{"line":17,"column":69},"end":{"line":17,"column":80}}}) : helper))) != null ? stack1 : "")
    + "\" arrowhead=none";
  stack1 = ((helper = (helper = helpers.tailportflags || (depth0 != null ? depth0.tailportflags : depth0)) != null ? helper : alias2),(options={"name":"tailportflags","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":18,"column":28},"end":{"line":18,"column":73}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.tailportflags) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += " ltail=\"cluster_"
    + ((stack1 = ((helper = (helper = helpers.from || (depth0 != null ? depth0.from : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"from","hash":{},"data":data,"loc":{"start":{"line":18,"column":89},"end":{"line":18,"column":99}}}) : helper))) != null ? stack1 : "")
    + "\"";
  stack1 = ((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : alias2),(options={"name":"color","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":19,"column":28},"end":{"line":19,"column":85}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.color) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += "]\n      \"self_"
    + ((stack1 = ((helper = (helper = helpers.from || (depth0 != null ? depth0.from : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"from","hash":{},"data":data,"loc":{"start":{"line":20,"column":12},"end":{"line":20,"column":22}}}) : helper))) != null ? stack1 : "")
    + "\" -> \""
    + ((stack1 = ((helper = (helper = helpers.from || (depth0 != null ? depth0.from : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"from","hash":{},"data":data,"loc":{"start":{"line":20,"column":28},"end":{"line":20,"column":38}}}) : helper))) != null ? stack1 : "")
    + "\" [lhead=\"cluster_"
    + ((stack1 = ((helper = (helper = helpers.from || (depth0 != null ? depth0.from : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"from","hash":{},"data":data,"loc":{"start":{"line":20,"column":56},"end":{"line":20,"column":66}}}) : helper))) != null ? stack1 : "")
    + "\"";
  stack1 = ((helper = (helper = helpers.headportflags || (depth0 != null ? depth0.headportflags : depth0)) != null ? helper : alias2),(options={"name":"headportflags","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":21,"column":28},"end":{"line":21,"column":73}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.headportflags) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : alias2),(options={"name":"color","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":22,"column":28},"end":{"line":22,"column":65}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.color) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "]\n";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " "
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "");
},"15":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " color=\""
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
    + "\"";
},"17":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.hooks.blockHelperMissing;

  return "      \"i_"
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "\" [shape=point style=invis margin=0 width=0 height=0 fixedsize=true]\n      \""
    + ((stack1 = alias1((depths[1] != null ? depths[1].from : depths[1]), depth0)) != null ? stack1 : "")
    + "\" -> \"i_"
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "\" [arrowhead=none"
    + ((stack1 = alias2.call(depth0,alias1((depths[1] != null ? depths[1].fromComposite : depths[1]), depth0),{"name":"../fromComposite","hash":{},"fn":container.program(18, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":28,"column":32},"end":{"line":28,"column":105}}})) != null ? stack1 : "")
    + ((stack1 = alias2.call(depth0,alias1((depths[1] != null ? depths[1].color : depths[1]), depth0),{"name":"../color","hash":{},"fn":container.program(15, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":29,"column":32},"end":{"line":29,"column":75}}})) != null ? stack1 : "")
    + "]\n      \"i_"
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "\" -> \""
    + ((stack1 = alias1((depths[1] != null ? depths[1].to : depths[1]), depth0)) != null ? stack1 : "")
    + "\" [label=\""
    + ((stack1 = alias2.call(depth0,alias1((depths[1] != null ? depths[1].label : depths[1]), depth0),{"name":"../label","hash":{},"fn":container.noop,"inverse":container.program(4, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":30,"column":43},"end":{"line":30,"column":70}}})) != null ? stack1 : "")
    + ((stack1 = alias1((depths[1] != null ? depths[1].label : depths[1]), depth0)) != null ? stack1 : "")
    + "\""
    + ((stack1 = alias2.call(depth0,alias1((depths[1] != null ? depths[1].toComposite : depths[1]), depth0),{"name":"../toComposite","hash":{},"fn":container.program(20, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":31,"column":32},"end":{"line":31,"column":99}}})) != null ? stack1 : "")
    + ((stack1 = alias2.call(depth0,alias1((depths[1] != null ? depths[1].color : depths[1]), depth0),{"name":"../color","hash":{},"fn":container.program(10, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":32,"column":32},"end":{"line":32,"column":95}}})) != null ? stack1 : "")
    + "]\n      \"i_"
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "\" -> \""
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "\" [style=dashed arrowtail=none arrowhead=none weight=0]\n      \""
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "\" [label=\""
    + ((stack1 = alias1((depths[1] != null ? depths[1].noteFlattened : depths[1]), depth0)) != null ? stack1 : "")
    + "\" shape=note fontsize=10 color=black fontcolor=black fillcolor=\"#ffffcc\" penwidth=1.0]\n";
},"18":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return " ltail=\"cluster_"
    + ((stack1 = container.lambda((depths[1] != null ? depths[1].from : depths[1]), depth0)) != null ? stack1 : "")
    + "\"";
},"20":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return " lhead=\"cluster_"
    + ((stack1 = container.lambda((depths[1] != null ? depths[1].to : depths[1]), depth0)) != null ? stack1 : "")
    + "\"";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", buffer = 
  "digraph \"state transitions\" {\n  "
    + ((stack1 = ((helper = (helper = helpers.graphAttributes || (depth0 != null ? depth0.graphAttributes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"graphAttributes","hash":{},"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":2,"column":23}}}) : helper))) != null ? stack1 : "")
    + "\n  node ["
    + ((stack1 = ((helper = (helper = helpers.nodeAttributes || (depth0 != null ? depth0.nodeAttributes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"nodeAttributes","hash":{},"data":data,"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":28}}}) : helper))) != null ? stack1 : "")
    + "]\n  edge ["
    + ((stack1 = ((helper = (helper = helpers.edgeAttributes || (depth0 != null ? depth0.edgeAttributes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"edgeAttributes","hash":{},"data":data,"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":28}}}) : helper))) != null ? stack1 : "")
    + "]\n\n"
    + ((stack1 = container.invokePartial(partials["dot.states.template.hbs"],depth0,{"name":"dot.states.template.hbs","data":data,"indent":"  ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n";
  stack1 = ((helper = (helper = helpers.transitions || (depth0 != null ? depth0.transitions : depth0)) != null ? helper : alias2),(options={"name":"transitions","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":2},"end":{"line":36,"column":18}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.transitions) { stack1 = container.hooks.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "}\n";
},"usePartial":true,"useData":true,"useDepths":true});
