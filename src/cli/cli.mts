/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from "node:fs";
import { type Writable } from "node:stream";
import { parseArgs } from "node:util";
import satisfies from "semver/functions/satisfies.js";
import { formatError, displayLicense, transform } from "./actions.mjs";
import normalize from "./normalize.mjs";
import validations from "./validations.mjs";

const $package = JSON.parse(
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
);

const HELP_TEXT = `Usage: smcat [options] [infile]

Write beautiful state charts - https://github.com/sverweij/state-machine-cat

Options:
  -T, --output-type <type>  ast|dot|eps|json|oldeps|oldps|oldps2|oldsvg|pdf|
                            png|ps|ps2|scjson|scxml|smcat|svg
                            (default: "svg")
  -I, --input-type <type>   smcat|json|scxml (default: "smcat")
  -E, --engine <type>       dot|circo|fdp|neato|osage|twopi (default: "dot")
  -d, --direction <dir>     top-down|bottom-top|left-right|right-left (default:
                            "top-down")
  -o --output-to <file>     File to write to. use - for stdout.
  --desugar                 transform pseudo states into transitions
                            (!experimental!)
  -V, --version             output the version number
  -l, --license             Display license and exit
  -h, --help                display help for command
`;

function presentError(pError: any, pErrorStream: Writable) {
  pErrorStream.write(formatError(pError));
  process.exitCode = 1;
}

function kebabToCamel(pString: string): string {
  return pString
    .split("-")
    .map((pWord: string, pIndex: number) =>
      pIndex === 0
        ? pWord
        : pWord.charAt(0).toUpperCase() + pWord.slice(1).toLowerCase(),
    )
    .join("");
}

function camelizeObject(pObject: any): Record<string, string | boolean> {
  const lNewObject = {};

  for (const lKey in pObject) {
    if (Object.hasOwn(pObject, lKey)) {
      const camelCaseKey = kebabToCamel(lKey);
      // @ts-expect-error whatever. this just works
      // eslint-disable-next-line security/detect-object-injection
      lNewObject[camelCaseKey] = pObject[lKey];
    }
  }

  return lNewObject;
}

function parseArguments(pArguments: string[]): {
  values: Record<string, string | boolean>;
  positionals: string[];
} {
  const lOptions = {
    "output-type": {
      type: "string",
      short: "T",
      default: validations.defaultOutputType,
    },
    "input-type": {
      type: "string",
      short: "I",
      default: validations.defaultInputType,
    },
    engine: {
      type: "string",
      short: "E",
      default: validations.defaultEngine,
    },
    direction: {
      type: "string",
      short: "d",
      default: validations.defaultDirection,
    },
    "output-to": {
      type: "string",
      short: "o",
    },
    "dot-graph-attrs": {
      type: "string",
    },
    "dot-node-attrs": {
      type: "string",
    },
    "dot-edge-attrs": {
      type: "string",
    },
    desugar: {
      type: "boolean",
      default: false,
    },
    license: {
      type: "boolean",
      short: "l",
      default: false,
    },
    help: {
      type: "boolean",
      short: "h",
      default: false,
    },
    version: {
      type: "boolean",
      short: "V",
      default: false,
    },
  };

  const { values, positionals } = parseArgs({
    args: pArguments,
    // @ts-expect-error fuck typescript
    options: lOptions,
    strict: true,
    allowPositionals: true,
    tokens: false,
  });

  // Handle argument validation manually if needed
  // @ts-expect-error whatever
  values["output-type"] = validations.validOutputType(values["output-type"]);
  // @ts-expect-error whatever
  values["input-type"] = validations.validInputType(values["input-type"]);
  // @ts-expect-error whatever
  values.engine = validations.validEngine(values.engine);
  // @ts-expect-error whatever
  values.direction = validations.validDirection(values.direction);
  if (values["dot-graph-attrs"])
    values["dot-graph-attrs"] = validations.validDotAttrs(
      // @ts-expect-error whatever
      values["dot-graph-attrs"],
    );
  if (values["dot-node-attrs"])
    values["dot-node-attrs"] = validations.validDotAttrs(
      // @ts-expect-error whatever
      values["dot-node-attrs"],
    );
  if (values["dot-edge-attrs"])
    values["dot-edge-attrs"] = validations.validDotAttrs(
      // @ts-expect-error whatever
      values["dot-edge-attrs"],
    );

  return { values: camelizeObject(values), positionals };
}

function assertNodeVersion(
  pCurrentNodeVersion: string,
  pSupportedEngines: string,
) {
  /* c8 ignore start */
  if (!satisfies(pCurrentNodeVersion, pSupportedEngines)) {
    throw new Error(
      `\nERROR: your node version (${pCurrentNodeVersion}) is not recent enough.\n` +
        `       state-machine-cat is supported on node ${pSupportedEngines}\n\n`,
    );
  }
  /* c8 ignore stop */
}

interface IExecuteCommandLineOptions {
  currentNodeVersion: string;
  supportedEngines: string;
  outStream: Writable;
  errorStream: Writable;
}

export default async function cli(
  pArguments = process.argv,
  pOptions?: Partial<IExecuteCommandLineOptions>,
) {
  const lOptions = {
    currentNodeVersion: process.versions.node,
    supportedEngines: $package.engines.node,
    outStream: process.stdout,
    errorStream: process.stderr,
    ...pOptions,
  };
  try {
    assertNodeVersion(lOptions.currentNodeVersion, lOptions.supportedEngines);

    // eslint-disable-next-line no-magic-numbers
    const { values, positionals } = parseArguments(pArguments.slice(2));

    if (values.help) {
      // @ts-expect-error whatever. this just works
      lOptions.outStream.write(HELP_TEXT);
      return;
    }

    if (values.version) {
      // @ts-expect-error whatever. this just works
      lOptions.outStream.write(`${$package.version}\n`);
      return;
    }
    if (values.license) {
      displayLicense(lOptions.outStream);
      return;
    }
    await transform(
      validations.validateArguments(normalize(positionals[0], values)),
    );
  } catch (pError) {
    presentError(pError, lOptions.errorStream);
  }
}