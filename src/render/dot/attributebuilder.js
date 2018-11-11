const GENERIC_GRAPH_ATTRIBUTES = [
    {name: 'fontname', value: '"Helvetica"'},
    {name: 'fontsize', value: '12'},
    {name: 'penwidth', value: '2.0'}
];

const GRAPH_ATTRIBUTES = {
    dot: [
        {name: 'splines', value: 'true'},
        {name: 'ordering', value: 'out'},
        {name: 'compound', value: 'true'},
        {name: 'overlap', value: 'scale'},
        {name: 'nodesep', value: '0.3'},
        {name: 'ranksep', value: '0.1'}
    ],
    fdp: [
        {name: 'K', value: '0.9'}
    ],
    osage: [
        {name: 'pack', value: '42'}
    ],
    neato: [
        {name: 'epsilon', value: '0.9'}
    ]

};

const DIRECTION_ATTRIBUTES = {
    'bottom-top': [
        {name: 'rankdir', value: 'BT'}
    ],
    'left-right': [
        {name: 'rankdir', value: 'LR'}
    ],
    'right-left': [
        {name: 'rankdir', value: 'RL'}
    ]
};

const NODE_ATTRIBUTES = [
    {name: 'shape', value: 'plaintext'},
    {name: 'style', value: 'filled'},
    {name: 'fillcolor', value: 'transparent'},
    {name: 'fontname', value: 'Helvetica'},
    {name: 'fontsize', value: 12},
    {name: 'penwidth', value: '2.0'}
];

const EDGE_ATTRIBUTES = [
    {name: 'fontname', value:'Helvetica'},
    {name: 'fontsize', value: 10}
];

function toNameValueString(pAttribute) {
    return `${pAttribute.name}=${pAttribute.value}`;
}

module.exports = {
    buildGraphAttributes : (pEngine, pDirection, pDotGraphAttrs) => GENERIC_GRAPH_ATTRIBUTES
        .concat(GRAPH_ATTRIBUTES[pEngine] || [])
        .concat(DIRECTION_ATTRIBUTES[pDirection] || [])
        .concat(pDotGraphAttrs || [])
        .map(toNameValueString)
        .join(' '),
    buildNodeAttributes: (pDotNodeAttrs) => NODE_ATTRIBUTES
        .concat(pDotNodeAttrs || [])
        .map(toNameValueString)
        .join(' '),
    buildEdgeAttributes: (pDotEdgeAttrs) => EDGE_ATTRIBUTES
        .concat(pDotEdgeAttrs || [])
        .map(toNameValueString)
        .join(' ')
};
