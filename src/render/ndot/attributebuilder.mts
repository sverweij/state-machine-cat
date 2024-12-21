/* eslint-disable security/detect-object-injection */
interface INameValuePair {
  name: string;
  value: string | number;
}
const GENERIC_GRAPH_ATTRIBUTES: INameValuePair[] = [
  { name: "fontname", value: '"Helvetica"' },
  { name: "fontsize", value: "12" },
  { name: "penwidth", value: "2.0" },
];

const GRAPH_ATTRIBUTES: { [engine: string]: INameValuePair[] } = {
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

const DIRECTION_ATTRIBUTES: { [engine: string]: INameValuePair[] } = {
  "bottom-top": [{ name: "rankdir", value: "BT" }],
  "left-right": [{ name: "rankdir", value: "LR" }],
  "right-left": [{ name: "rankdir", value: "RL" }],
};

const NODE_ATTRIBUTES: INameValuePair[] = [
  { name: "shape", value: "plaintext" },
  { name: "style", value: "filled" },
  { name: "fillcolor", value: '"#FFFFFF01"' },
  { name: "fontname", value: "Helvetica" },
  { name: "fontsize", value: 12 },
  { name: "penwidth", value: "2.0" },
];

const EDGE_ATTRIBUTES: INameValuePair[] = [
  { name: "fontname", value: "Helvetica" },
  { name: "fontsize", value: 10 },
];

function toNameValueString(pAttribute: INameValuePair): string {
  return `${pAttribute.name}=${pAttribute.value}`;
}

export function buildGraphAttributes(
  pEngine: string,
  pDirection: string,
  pDotGraphAttributes?: INameValuePair[],
): string {
  return GENERIC_GRAPH_ATTRIBUTES.concat(GRAPH_ATTRIBUTES[pEngine] || [])
    .concat(DIRECTION_ATTRIBUTES[pDirection] || [])
    .concat(pDotGraphAttributes || [])
    .map(toNameValueString)
    .join(" ");
}

export function buildNodeAttributes(
  pDotNodeAttributes?: INameValuePair[],
): string {
  return NODE_ATTRIBUTES.concat(pDotNodeAttributes || [])
    .map(toNameValueString)
    .join(" ");
}

export function buildEdgeAttributes(
  pDotEdgeAttributes?: INameValuePair[],
): string {
  return EDGE_ATTRIBUTES.concat(pDotEdgeAttributes || [])
    .map(toNameValueString)
    .join(" ");
}

export default {
  buildGraphAttributes,
  buildNodeAttributes,
  buildEdgeAttributes,
};
