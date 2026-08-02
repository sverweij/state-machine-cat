import { spawnSync } from "node:child_process";
import type { EngineType, OutputType } from "#types/state-machine-cat.mjs";

// eslint-disable-next-line import/exports-last
export type DotToVectorNativeOptionsType = {
  exec: string;
  format: OutputType;
  engine: EngineType;
};

const DEFAULT_OPTIONS: DotToVectorNativeOptionsType = {
  exec: "dot",
  format: "svg",
  engine: "dot",
};
// Formats graphviz emits as binary. These get returned as latin1 ('binary')
// strings, so callers can Buffer.from(result, "binary") to get the bytes back.
// The text formats get decoded as utf8 - decoding them as latin1 mangles any
// non-ASCII the diagram contains.
const BINARY_FORMATS: Set<string> = new Set(["png", "pdf"]);

/**
 * Takes a graphviz dot program (as a string), runs it through the dot
 * executable specified in pOptions.exec (default: 'dot') and returns
 * the result
 *
 * @param  pDot        The dot program as a string
 * @param  pOptions
 * @returns the dot program converted into an svg
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
    [`-K${lOptions.engine}`, `-T${lOptions.format}`],
    {
      // cwd: lOptions.workingDirectory,
      input: pDot,
    },
  );

  //  0: okeleedokelee
  //  1: error in the program
  // -2: executable not found
  if (status === 0) {
    return stdout.toString(
      BINARY_FORMATS.has(lOptions.format) ? "binary" : "utf8",
    );
  } else if (error) {
    // @ts-expect-error we should probably use error.message here
    throw new Error(error);
  } else {
    throw new Error(`Unexpected error occurred. Exit code ${status}`);
  }
}

export function isAvailable(
  pOptions: Partial<DotToVectorNativeOptionsType>,
): boolean {
  const lOptions: DotToVectorNativeOptionsType = {
    ...DEFAULT_OPTIONS,
    ...pOptions,
  };
  const { status, stderr } = spawnSync(lOptions.exec, ["-V"]);

  return (
    status === 0 && stderr.toString("utf8").startsWith("dot - graphviz version")
  );
}
