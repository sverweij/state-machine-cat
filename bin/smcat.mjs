#!/usr/bin/env node
import { program } from "commander";
import satisfies from "semver/functions/satisfies.js";
import { readFileSync } from "node:fs";
import actions from "../src/cli/actions.mjs";
import makeDescription from "../src/cli/make-description.mjs";
import normalize from "../src/cli/normalize.mjs";
import validations from "../src/cli/validations.mjs";

const $package = JSON.parse(
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

function presentError(pError) {
  process.stderr.write(actions.formatError(pError));

  /* eslint no-process-exit:0 */
  process.exit(1);
}

try {
  program
    .version($package.version)
    .description(makeDescription())
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
    .option(
      "--dot-graph-attrs <string>",
      "graph attributes to pass to the dot render engine",
      validations.validDotAttrs
    )
    .option(
      "--dot-node-attrs <string>",
      "node attributes to pass to the dot render engine",
      validations.validDotAttrs
    )
    .option(
      "--dot-edge-attrs <string>",
      "edge attributes to pass to the dot render engine",
      validations.validDotAttrs
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
  actions.transform(
    validations.validateArguments(normalize(program.args[0], program.opts()))
  );
} catch (pError) {
  presentError(pError);
}
