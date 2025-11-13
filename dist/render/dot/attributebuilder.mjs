const GENERIC_GRAPH_ATTRIBUTES = [
	{ name: "fontname", value: '"Helvetica"' },
	{ name: "fontsize", value: "12" },
	{ name: "penwidth", value: "2.0" },
];
const GRAPH_ATTRIBUTES = {
	dot: [
		{ name: "splines", value: "true" },
		{ name: "ordering", value: "out" },
		{ name: "compound", value: "true" },
		{ name: "overlap", value: "scale" },
		{ name: "nodesep", value: "0.3" },
		{ name: "ranksep", value: "0.1" },
	],
	fdp: [{ name: "K", value: "0.9" }],
	osage: [{ name: "pack", value: "42" }],
	neato: [{ name: "epsilon", value: "0.9" }],
};
const DIRECTION_ATTRIBUTES = {
	"bottom-top": [{ name: "rankdir", value: "BT" }],
	"left-right": [{ name: "rankdir", value: "LR" }],
	"right-left": [{ name: "rankdir", value: "RL" }],
};
const NODE_ATTRIBUTES = [
	{ name: "shape", value: "plaintext" },
	{ name: "style", value: "filled" },
	{ name: "fillcolor", value: '"#FFFFFF01"' },
	{ name: "fontname", value: "Helvetica" },
	{ name: "fontsize", value: 12 },
	{ name: "penwidth", value: "2.0" },
];
const EDGE_ATTRIBUTES = [
	{ name: "fontname", value: "Helvetica" },
	{ name: "fontsize", value: 10 },
];
function toNameValueString(pAttribute) {
	return `${pAttribute.name}=${pAttribute.value}`;
}
export function buildGraphAttributes(pEngine, pDirection, pDotGraphAttributes) {
	const lParts = [];
	for (const lAttribute of GENERIC_GRAPH_ATTRIBUTES) {
		lParts.push(lAttribute);
	}
	for (const lAttribute of GRAPH_ATTRIBUTES[pEngine] || []) {
		lParts.push(lAttribute);
	}
	for (const lAttribute of DIRECTION_ATTRIBUTES[pDirection] || []) {
		lParts.push(lAttribute);
	}
	for (const lAttribute of pDotGraphAttributes || []) {
		lParts.push(lAttribute);
	}
	return lParts.map(toNameValueString).join(" ");
}
export function buildNodeAttributes(pDotNodeAttributes) {
	return NODE_ATTRIBUTES.concat(pDotNodeAttributes || [])
		.map(toNameValueString)
		.join(" ");
}
export function buildEdgeAttributes(pDotEdgeAttributes) {
	return EDGE_ATTRIBUTES.concat(pDotEdgeAttributes || [])
		.map(toNameValueString)
		.join(" ");
}
