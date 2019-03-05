var Handlebars = require("handlebars/dist/handlebars.runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['smcat.template.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=helpers.blockHelperMissing, buffer = "";

  stack1 = ((helper = (helper = helpers.note || (depth0 != null ? depth0.note : depth0)) != null ? helper : alias2),(options={"name":"note","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.note) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += ((stack1 = (helpers.quotifyState || (depth0 && depth0.quotifyState) || alias2).call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"quotifyState","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
  stack1 = ((helper = (helper = helpers.hasExtendedAttributes || (depth0 != null ? depth0.hasExtendedAttributes : depth0)) != null ? helper : alias2),(options={"name":"hasExtendedAttributes","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.hasExtendedAttributes) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.actions : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
  stack1 = ((helper = (helper = helpers.actions || (depth0 != null ? depth0.actions : depth0)) != null ? helper : alias2),(options={"name":"actions","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.actions) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.statemachine || (depth0 != null ? depth0.statemachine : depth0)) != null ? helper : alias2),(options={"name":"statemachine","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.statemachine) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + ((stack1 = helpers["if"].call(alias1,(data && data.last),{"name":"if","hash":{},"fn":container.program(21, data, 0),"inverse":container.program(23, data, 0),"data":data})) != null ? stack1 : "")
    + "\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "# "
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
    + "\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=helpers.blockHelperMissing, buffer = 
  " [";
  stack1 = ((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(options={"name":"type","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.type) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(options={"name":"label","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.label) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : alias2),(options={"name":"color","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.color) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.active : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "]";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "type="
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "");
},"9":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " label=\""
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
    + "\"";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " color=\""
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
    + "\"";
},"13":function(container,depth0,helpers,partials,data) {
    return " active";
},"15":function(container,depth0,helpers,partials,data) {
    return ": ";
},"17":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.quotifyActions || (depth0 && depth0.quotifyActions) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"quotifyActions","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"19":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " {\n"
    + ((stack1 = container.invokePartial(partials["smcat.template.hbs"],depth0,{"name":"smcat.template.hbs","data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "}";
},"21":function(container,depth0,helpers,partials,data) {
    return ";";
},"23":function(container,depth0,helpers,partials,data) {
    return ",";
},"25":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=helpers.blockHelperMissing, buffer = "";

  stack1 = ((helper = (helper = helpers.note || (depth0 != null ? depth0.note : depth0)) != null ? helper : alias2),(options={"name":"note","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.note) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += ((stack1 = (helpers.quotifyState || (depth0 && depth0.quotifyState) || alias2).call(alias1,(depth0 != null ? depth0.from : depth0),{"name":"quotifyState","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " => "
    + ((stack1 = (helpers.quotifyState || (depth0 && depth0.quotifyState) || alias2).call(alias1,(depth0 != null ? depth0.to : depth0),{"name":"quotifyState","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
  stack1 = ((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : alias2),(options={"name":"color","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.color) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(options={"name":"label","hash":{},"fn":container.program(28, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.label) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + ";\n";
},"26":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " [color=\""
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
    + "\"]";
},"28":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ": "
    + ((stack1 = (helpers.quotifyLabel || (depth0 && depth0.quotifyLabel) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"quotifyLabel","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), buffer = 
  ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.states : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
  stack1 = ((helper = (helper = helpers.transitions || (depth0 != null ? depth0.transitions : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"transitions","hash":{},"fn":container.program(25, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.transitions) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"usePartial":true,"useData":true});
