var Handlebars = require("handlebars/dist/handlebars.runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['scxml.template.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.propertyIsEnumerable;

  return "initial=\""
    + container.escapeExpression(((helper = (helper = helpers.initial || (depth0 != null ? depth0.initial : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"initial","hash":{},"data":data,"loc":{"start":{"line":2,"column":71},"end":{"line":2,"column":82}}}) : helper)))
    + "\" ";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.propertyIsEnumerable;

  return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<scxml xmlns=\"http://www.w3.org/2005/07/scxml\" "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.initial : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":47},"end":{"line":2,"column":91}}})) != null ? stack1 : "")
    + "version=\"1.0\">\n"
    + ((stack1 = container.invokePartial(partials["scxml.states.template.hbs"],depth0,{"name":"scxml.states.template.hbs","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</scxml>\n";
},"usePartial":true,"useData":true});
