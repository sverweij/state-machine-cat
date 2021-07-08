// eslint-disable-next-line security/detect-child-process
import { spawnSync } from "node:child_process";

const DEFAULT_OPTIONS = {
  exec: "dot",
  format: "svg",
};

/**
 * Takes a graphviz dot program (as a string), runs it through the dot
 * executable specified in pOptions.exec (default: 'dot') and returns
 * the result
 *
 * @param  {string} pDot        The dot program as a string
 * @param  {object} pOptions
 *         exec: the path to the executable to run. Default: 'dot'
 * @return {string} the dot program converted into an svg
 * @throws {Error} when something ontowards has happened (executable not found, erroneous dot program)
 */
function convert(pDot, pOptions) {
  const lOptions = {
    ...DEFAULT_OPTIONS,
    ...pOptions,
  };
  const { stdout, status, error } = spawnSync(
    lOptions.exec,
    [`-T${lOptions.format}`],
    {
      // cwd: lOptions.workingDirectory,
      input: pDot,
    }
  );

  //  0: okeleedokelee
  //  1: error in the program
  // -2: executable not found
  if (status === 0) {
    return stdout.toString("utf8");
  } else if (error) {
    throw new Error(error);
  } else {
    throw new Error(`Unexpected error occurred. Exit code ${status}`);
  }
}

function isAvailable(pOptions) {
  const lOptions = {
    ...DEFAULT_OPTIONS,
    ...pOptions,
  };
  const { status, stderr } = spawnSync(lOptions.exec, ["-V"]);

  return (
    status === 0 && stderr.toString("utf8").startsWith("dot - graphviz version")
  );
}

export default {
  convert,
  isAvailable,
};
