const ALLOWED_VALUES = Object.freeze({
    inputType: {
        default: "smcat",
        values: [{ name: "smcat" }, { name: "json" }, { name: "scxml" }],
    },
    outputType: {
        default: "svg",
        values: [
            { name: "ast" },
            { name: "dot" },
            { name: "ndot" },
            { name: "eps" },
            { name: "json" },
            { name: "oldeps" },
            { name: "oldps" },
            { name: "oldps2" },
            { name: "oldsvg" },
            { name: "pdf" },
            { name: "png" },
            { name: "ps" },
            { name: "ps2" },
            { name: "scjson" },
            { name: "scxml" },
            { name: "smcat" },
            { name: "svg" },
        ],
    },
    engine: {
        default: "dot",
        values: [
            { name: "dot" },
            { name: "circo" },
            { name: "fdp" },
            { name: "neato" },
            { name: "osage" },
            { name: "twopi" },
        ],
    },
    direction: {
        default: "top-down",
        values: [
            { name: "top-down" },
            { name: "bottom-top" },
            { name: "left-right" },
            { name: "right-left" },
        ],
    },
    desugar: {
        default: false,
        values: [{ name: true }, { name: false }],
    },
});
export function getOptionValue(pOptions, pOptionName) {
    return pOptions?.[pOptionName] ?? ALLOWED_VALUES[pOptionName].default;
}
export function getAllowedValues() {
    return ALLOWED_VALUES;
}
export default {
    getAllowedValues,
    getOptionValue,
};
