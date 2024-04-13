import Handlebars from "handlebars/dist/handlebars.runtime.js";
await import("./scxml.template.js");
await import("./scxml.states.template.js");
Handlebars.registerPartial(
	"scxml.states.template.hbs",
	Handlebars.templates["scxml.states.template.hbs"],
);
export default function renderSCXML(pSCJSON) {
	return Handlebars.templates["scxml.template.hbs"](pSCJSON);
}
