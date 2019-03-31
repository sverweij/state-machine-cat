var Handlebars = require("handlebars/dist/handlebars.runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['xmi.template.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<xmi:XMI xmi:version=\"2.1\" xmlns:uml=\"http://schema.omg.org/spec/UML/2.0\" xmlns:xmi=\"http://schema.omg.org/spec/XMI/2.1\">\n    <xmi:Documentation exporter=\"state-machine-cat\"/>\n    <uml:Model xmi:id=\"rootmodel\" xmi:type=\"uml:Model\" name=\"RootModel\">\n        <packagedElement xmi:id=\"model\" name=\"Model\" visibility=\"public\" xmi:type=\"uml:Model\">\n            <packagedElement xmi:id=\"statemachine\" name=\"AStateMachine\" visibility=\"public\" isReentrant=\"true\" xmi:type=\"uml:StateMachine\">\n"
    + ((stack1 = container.invokePartial(partials["xmi.states.template.hbs"],depth0,{"name":"xmi.states.template.hbs","data":data,"indent":"                ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n            </packagedElement>\n        </packagedElement>\n    </uml:Model>\n</xmi:XMI>";
},"usePartial":true,"useData":true});
