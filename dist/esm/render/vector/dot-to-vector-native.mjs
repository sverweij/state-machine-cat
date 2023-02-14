import { spawnSync } from "node:child_process";
const DEFAULT_OPTIONS = {
    exec: "dot",
    format: "svg",
};
function convert(pDot, pOptions) {
    const lOptions = {
        ...DEFAULT_OPTIONS,
        ...pOptions,
    };
    const { stdout, status, error } = spawnSync(lOptions.exec, [`-T${lOptions.format}`], {
        input: pDot,
    });
    if (status === 0) {
        return stdout.toString("binary");
    }
    else if (error) {
        throw new Error(error);
    }
    else {
        throw new Error(`Unexpected error occurred. Exit code ${status}`);
    }
}
function isAvailable(pOptions) {
    const lOptions = {
        ...DEFAULT_OPTIONS,
        ...pOptions,
    };
    const { status, stderr } = spawnSync(lOptions.exec, ["-V"]);
    return (status === 0 && stderr.toString("utf8").startsWith("dot - graphviz version"));
}
export default {
    convert,
    isAvailable,
};
