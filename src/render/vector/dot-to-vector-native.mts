import { spawnSync } from "node:child_process";
import type { OutputType } from "types/state-machine-cat.mjs";

// eslint-disable-next-line import/exports-last
export type DotToVectorNativeOptionsType = {
  exec: string;
  format: OutputType;
};

const DEFAULT_OPTIONS: DotToVectorNativeOptionsType = {
  exec: "dot",
  format: "svg",
};

/**
 * Takes a graphviz dot program (as a string), runs it through the dot
 * executable specified in pOptions.exec (default: 'dot') and returns
 * the result
 *
 * @param  pDot        The dot program as a string
 * @param  pOptions
 * @return the dot program converted into an svg
 * @throws {Error} when something untoward has happened (executable not found, erroneous dot program)
 */
export function convert(
  pDot: string,
  pOptions?: Partial<DotToVectorNativeOptionsType>,
): string {
  const lOptions: DotToVectorNativeOptionsType = {
    ...DEFAULT_OPTIONS,
    ...pOptions,
  };
  const { stdout, status, error } = spawnSync(
    lOptions.exec,
    [`-T${lOptions.format}`],
    {
      // cwd: lOptions.workingDirectory,
      input: pDot,
    },
  );

  //  0: okeleedokelee
  //  1: error in the program
  // -2: executable not found
  if (status === 0) {
    return stdout.toString("binary");
  } else if (error) {
    // @ts-expect-error we should probably use error.message here
    throw new Error(error);
  } else {
    throw new Error(`Unexpected error occurred. Exit code ${status}`);
  }
}

export function isAvailable(pOptions: Partial<DotToVectorNativeOptionsType>) {
  const lOptions: DotToVectorNativeOptionsType = {
    ...DEFAULT_OPTIONS,
    ...pOptions,
  };
  const { status, stderr } = spawnSync(lOptions.exec, ["-V"]);

  return (
    status === 0 && stderr.toString("utf8").startsWith("dot - graphviz version")
  );
}
