var Handlebars = require("handlebars/dist/handlebars.runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['scxml.template.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<scxml xmlns=\"http://www.w3.org/2005/07/scxml\" version=\"1.0\">\n"
    + ((stack1 = container.invokePartial(partials["scxml.states.template.hbs"],depth0,{"name":"scxml.states.template.hbs","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</scxml>\n";
},"usePartial":true,"useData":true});
