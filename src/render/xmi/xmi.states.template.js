var Handlebars = require("handlebars/dist/handlebars.runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['xmi.states.template.hbs'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <subvertex xmi:id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":3,"column":23},"end":{"line":3,"column":29}}}) : helper)))
    + "\" name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":3,"column":37},"end":{"line":3,"column":45}}}) : helper)))
    + "\" visibility=\"public\" xmi:type=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data,"loc":{"start":{"line":3,"column":77},"end":{"line":3,"column":85}}}) : helper)))
    + "\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.kind : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":86},"end":{"line":3,"column":121}}})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.actions : depth0),{"name":"each","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":4},"end":{"line":6,"column":13}}})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.statemachine : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":4},"end":{"line":10,"column":11}}})) != null ? stack1 : "")
    + "    </subvertex>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper;

  return " kind=\""
    + container.escapeExpression(((helper = (helper = helpers.kind || (depth0 != null ? depth0.kind : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"kind","hash":{},"data":data,"loc":{"start":{"line":3,"column":105},"end":{"line":3,"column":113}}}) : helper)))
    + "\"";
},"4":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data,"loc":{"start":{"line":5,"column":9},"end":{"line":5,"column":17}}}) : helper)))
    + " xmi:id=\""
    + alias4(container.lambda((depths[1] != null ? depths[1].id : depths[1]), depth0))
    + "_"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data,"loc":{"start":{"line":5,"column":36},"end":{"line":5,"column":44}}}) : helper)))
    + "_"
    + alias4(((helper = (helper = helpers.body || (depth0 != null ? depth0.body : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"body","hash":{},"data":data,"loc":{"start":{"line":5,"column":45},"end":{"line":5,"column":53}}}) : helper)))
    + "\" name=\""
    + alias4(((helper = (helper = helpers.body || (depth0 != null ? depth0.body : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"body","hash":{},"data":data,"loc":{"start":{"line":5,"column":61},"end":{"line":5,"column":69}}}) : helper)))
    + "\" visibility=\"public\" isReentrant=\"true\" xmi:type=\"uml:OpaqueBehavior\"/>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["xmi.states.template.hbs"],depth0,{"name":"xmi.states.template.hbs","data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <transition xmi:id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":14,"column":24},"end":{"line":14,"column":30}}}) : helper)))
    + "_"
    + alias4(((helper = (helper = helpers.condId || (depth0 != null ? depth0.condId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"condId","hash":{},"data":data,"loc":{"start":{"line":14,"column":31},"end":{"line":14,"column":41}}}) : helper)))
    + alias4(((helper = (helper = helpers.eventId || (depth0 != null ? depth0.eventId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"eventId","hash":{},"data":data,"loc":{"start":{"line":14,"column":41},"end":{"line":14,"column":52}}}) : helper)))
    + alias4(((helper = (helper = helpers.actionId || (depth0 != null ? depth0.actionId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"actionId","hash":{},"data":data,"loc":{"start":{"line":14,"column":52},"end":{"line":14,"column":64}}}) : helper)))
    + "\" visibility=\"public\" xmi:type=\"uml:Transition\" source=\""
    + alias4(((helper = (helper = helpers.from || (depth0 != null ? depth0.from : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"from","hash":{},"data":data,"loc":{"start":{"line":14,"column":120},"end":{"line":14,"column":128}}}) : helper)))
    + "\" target=\""
    + alias4(((helper = (helper = helpers.to || (depth0 != null ? depth0.to : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"to","hash":{},"data":data,"loc":{"start":{"line":14,"column":138},"end":{"line":14,"column":144}}}) : helper)))
    + "\" kind=\"external\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.cond : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":4},"end":{"line":17,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.event : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":18,"column":4},"end":{"line":22,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.action : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":23,"column":4},"end":{"line":25,"column":11}}})) != null ? stack1 : "")
    + "    </transition>\n";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <guard xmi:id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":16,"column":23},"end":{"line":16,"column":29}}}) : helper)))
    + "_guard_"
    + alias4(((helper = (helper = helpers.condId || (depth0 != null ? depth0.condId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"condId","hash":{},"data":data,"loc":{"start":{"line":16,"column":36},"end":{"line":16,"column":46}}}) : helper)))
    + "\" xmi:type=\"uml:Constraint\" specification=\""
    + alias4(((helper = (helper = helpers.cond || (depth0 != null ? depth0.cond : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cond","hash":{},"data":data,"loc":{"start":{"line":16,"column":89},"end":{"line":16,"column":97}}}) : helper)))
    + "\"/>\n";
},"11":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <ownedMember xmi:id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":19,"column":29},"end":{"line":19,"column":35}}}) : helper)))
    + "_event_"
    + alias4(((helper = (helper = helpers.eventId || (depth0 != null ? depth0.eventId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"eventId","hash":{},"data":data,"loc":{"start":{"line":19,"column":42},"end":{"line":19,"column":53}}}) : helper)))
    + "\" name=\""
    + alias4(((helper = (helper = helpers.event || (depth0 != null ? depth0.event : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"event","hash":{},"data":data,"loc":{"start":{"line":19,"column":61},"end":{"line":19,"column":70}}}) : helper)))
    + "\" visibility=\"public\" xmi:type=\"uml:AnyReceiveEvent\"/>\n        <trigger xmi:id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":20,"column":25},"end":{"line":20,"column":31}}}) : helper)))
    + "_event\" xmi:type=\"uml:Trigger\" name=\""
    + alias4(((helper = (helper = helpers.event || (depth0 != null ? depth0.event : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"event","hash":{},"data":data,"loc":{"start":{"line":20,"column":68},"end":{"line":20,"column":77}}}) : helper)))
    + "\" event=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":20,"column":86},"end":{"line":20,"column":92}}}) : helper)))
    + "_event_"
    + alias4(((helper = (helper = helpers.event || (depth0 != null ? depth0.event : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"event","hash":{},"data":data,"loc":{"start":{"line":20,"column":99},"end":{"line":20,"column":108}}}) : helper)))
    + "\"/>\n        <trigger xmi:id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":21,"column":25},"end":{"line":21,"column":31}}}) : helper)))
    + "_event_"
    + alias4(((helper = (helper = helpers.eventId || (depth0 != null ? depth0.eventId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"eventId","hash":{},"data":data,"loc":{"start":{"line":21,"column":38},"end":{"line":21,"column":49}}}) : helper)))
    + "\" name=\""
    + alias4(((helper = (helper = helpers.event || (depth0 != null ? depth0.event : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"event","hash":{},"data":data,"loc":{"start":{"line":21,"column":57},"end":{"line":21,"column":66}}}) : helper)))
    + "\" visibility=\"public\" xmi:type=\"uml:AnyReceiveEvent\"/>\n";
},"13":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <effect xmi:id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":24,"column":24},"end":{"line":24,"column":30}}}) : helper)))
    + "_effect_"
    + alias4(((helper = (helper = helpers.actionId || (depth0 != null ? depth0.actionId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"actionId","hash":{},"data":data,"loc":{"start":{"line":24,"column":38},"end":{"line":24,"column":50}}}) : helper)))
    + "\" name=\""
    + alias4(((helper = (helper = helpers.action || (depth0 != null ? depth0.action : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"action","hash":{},"data":data,"loc":{"start":{"line":24,"column":58},"end":{"line":24,"column":68}}}) : helper)))
    + "\" visibility=\"public\" isReentrant=\"true\" xmi:type=\"uml:Activity\"/>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<region xmi:id=\"region_"
    + container.escapeExpression(((helper = (helper = helpers.regionCount || (depth0 != null ? depth0.regionCount : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"regionCount","hash":{},"data":data,"loc":{"start":{"line":1,"column":23},"end":{"line":1,"column":38}}}) : helper)))
    + "\" visibility=\"public\" xmi:type=\"uml:Region\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.states : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":0},"end":{"line":12,"column":9}}})) != null ? stack1 : "")
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.transitions : depth0),{"name":"each","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":13,"column":0},"end":{"line":27,"column":9}}})) != null ? stack1 : "")
    + "</region>";
},"usePartial":true,"useData":true,"useDepths":true});
