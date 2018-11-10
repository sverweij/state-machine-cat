const GENERIC_ATTRIBUTES = [
    {name: 'fontname', value: '"Helvetica"'},
    {name: 'fontsize', value: '12'},
    {name: 'penwidth', value: '2.0'}
];

const ATTRIBUTES = {
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

module.exports = (pEngine, pDirection, pdotGraphParams) => GENERIC_ATTRIBUTES
    .concat(ATTRIBUTES[pEngine] || [])
    .concat(DIRECTION_ATTRIBUTES[pDirection] || [])
    .concat(pdotGraphParams || [])
    .map((pAttribute) => `${pAttribute.name}=${pAttribute.value}`)
    .join(' ');
