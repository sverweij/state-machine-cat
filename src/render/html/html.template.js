var Handlebars = require("handlebars/dist/handlebars.runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['html.template.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "<th>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</th>";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=container.propertyIsEnumerable, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", buffer = 
  "        <tr>\n            <td class=\"rowheader\">"
    + container.escapeExpression(((helper = (helper = helpers.rowname || (depth0 != null ? depth0.rowname : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"rowname","hash":{},"data":data,"loc":{"start":{"line":8,"column":34},"end":{"line":8,"column":45}}}) : helper)))
    + "</td>";
  stack1 = ((helper = (helper = helpers.values || (depth0 != null ? depth0.values : depth0)) != null ? helper : alias3),(options={"name":"values","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":50},"end":{"line":8,"column":86}}}),(typeof helper === alias4 ? helper.call(alias2,options) : helper));
  if (!helpers.values) { stack1 = container.hooks.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n        </tr>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "<td>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</td>";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=container.propertyIsEnumerable, alias2=container.lambda, alias3=container.hooks.blockHelperMissing, buffer = 
  "<table>\n    <thead>\n        <th>"
    + container.escapeExpression(alias2(((stack1 = (depth0 != null ? depth0.header : depth0)) != null ? stack1.rowname : stack1), depth0))
    + "</th>"
    + ((stack1 = alias3.call(depth0,alias2(((stack1 = (depth0 != null ? depth0.header : depth0)) != null ? stack1.values : stack1), depth0),{"name":"header.values","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":35},"end":{"line":3,"column":85}}})) != null ? stack1 : "")
    + "\n    </thead>\n    <tbody>\n";
  stack1 = ((helper = (helper = helpers.rows || (depth0 != null ? depth0.rows : depth0)) != null ? helper : container.hooks.helperMissing),(options={"name":"rows","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":8},"end":{"line":10,"column":17}}}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),options) : helper));
  if (!helpers.rows) { stack1 = alias3.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </tbody>\n</table>\n";
},"useData":true});
