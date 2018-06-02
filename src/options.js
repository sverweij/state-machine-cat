const ALLOWED_VALUES = Object.freeze({
    inputType: {
        default: "smcat",
        values: [
            {name: "smcat"},
            {name: "json"}
        ]
    },
    outputType: {
        default: "svg",
        values: [
            {name: "svg"},
            {name: "dot"},
            {name: "smcat"},
            {name: "json"},
            {name: "ast"},
            {name: "html"},
            {name: "scxml"},
            {name: "scjson"}
        ]
    },
    engine: {
        default: "dot",
        values: [
            {name: "dot"},
            {name: "circo"},
            {name: "fdp"},
            {name: "neato"},
            {name: "osage"},
            {name: "twopi"}
        ]
    },
    direction: {
        default: "top-down",
        values: [
            {name: "top-down"},
            {name: "left-right"}
        ]
    }
});

function getOptionValue(pOptions, pOption) {
    let lRetval = ALLOWED_VALUES[pOption].default;

    if (Boolean(pOptions) && pOptions.hasOwnProperty(pOption)){
        lRetval = pOptions[pOption];
    }
    return lRetval;
}

function getAllowedValues() {
    return ALLOWED_VALUES;
}

module.exports = {
    getAllowedValues,
    getOptionValue
};
