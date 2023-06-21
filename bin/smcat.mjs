#!/usr/bin/env node
// @ts-check
import { readFileSync } from "node:fs";
import { program } from "commander";
import satisfies from "semver/functions/satisfies.js";
import actions from "../dist/esm/cli/actions.mjs";
import normalize from "../dist/esm/cli/normalize.mjs";
import validations from "../dist/esm/cli/validations.mjs";

const $package = JSON.parse(
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  readFileSync(new URL("../package.json", import.meta.url), "utf8")
);

/* c8 ignore start */
if (!satisfies(process.versions.node, $package.engines.node)) {
  process.stderr.write(
    `\nERROR: your node version (${process.versions.node}) is not recent enough.\n`
  );
  process.stderr.write(
    `       state-machine-cat is supported on node ${$package.engines.node}\n\n`
  );

  /* eslint node/no-process-exit: 0 */
  process.exit(-1);
}
/* c8 ignore stop */

/**
 * @param {any} pError
 * @return {void}
 */
function presentError(pError) {
  process.stderr.write(actions.formatError(pError));

  /* eslint no-process-exit:0 */
  process.exit(1);
}

try {
  program
    .version($package.version)
    .description(
      "Write beautiful state charts - https://github.com/sverweij/state-machine-cat"
    )
    .option(
      "-T --output-type <type>",
      validations.validOutputTypeRE,
      validations.validOutputType,
      validations.defaultOutputType
    )
    .option(
      "-I --input-type <type>",
      validations.validInputTypeRE,
      validations.validInputType,
      validations.defaultInputType
    )
    .option(
      "-E --engine <type>",
      validations.validEngineRE,
      validations.validEngine,
      validations.defaultEngine
    )
    .option(
      "-d --direction <dir>",
      validations.validDirectionRE,
      validations.validDirection,
      validations.defaultDirection
    )
    .option("-o --output-to <file>", "File to write to. use - for stdout.")
    .addOption(
      // @ts-expect-error Option doesn't exist on Command - probably because it doesn't exist on the typedef
      new program.Option(
        "--dot-graph-attrs <string>",
        "graph attributes to pass to the dot render engine",
        validations.validDotAttrs
      ).hideHelp(true)
    )
    .addOption(
      // @ts-expect-error Option doesn't exist on Command - probably because it doesn't exist on the typedef
      new program.Option(
        "--dot-node-attrs <string>",
        "node attributes to pass to the dot render engine",
        validations.validDotAttrs
      ).hideHelp(true)
    )
    .addOption(
      // @ts-expect-error Option doesn't exist on Command - probably because it doesn't exist on the typedef
      new program.Option(
        "--dot-edge-attrs <string>",
        "edge attributes to pass to the dot render engine",
        validations.validDotAttrs
      ).hideHelp(true)
    )
    .option(
      "--desugar",
      "transform pseudo states into transitions (!experimental!)"
    )
    .option("-l --license", "Display license and exit", () => {
      process.stdout.write(actions.LICENSE);
      process.exit(0);
    })
    .arguments("[infile]")
    .parse(process.argv);
  actions
    .transform(
      validations.validateArguments(normalize(program.args[0], program.opts()))
    )
    .catch(presentError);
} catch (pError) {
  presentError(pError);
}
