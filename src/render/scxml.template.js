var Handlebars = require("handlebars/dist/handlebars.runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['scxml.template.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "initial=\""
    + container.escapeExpression(((helper = (helper = helpers.initial || (depth0 != null ? depth0.initial : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"initial","hash":{},"data":data}) : helper)))
    + "\" ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<scxml xmlns=\"http://www.w3.org/2005/07/scxml\" "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.initial : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "version=\"1.0\">\n"
    + ((stack1 = container.invokePartial(partials["scxml.states.template.hbs"],depth0,{"name":"scxml.states.template.hbs","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</scxml>\n";
},"usePartial":true,"useData":true});
