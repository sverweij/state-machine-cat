#!/usr/bin/env node
const program = require("commander");
const semver = require("semver");
const $package = require("../package.json");
const makeDescription = require("../src/cli/make-description.cjs");

/* istanbul ignore if  */
if (!semver.satisfies(process.versions.node, $package.engines.node)) {
  process.stderr.write(
    `\nERROR: your node version (${process.versions.node}) is not recent enough.\n`
  );
  process.stderr.write(
    `       state-machine-cat is supported on node ${$package.engines.node}\n\n`
  );

  /* eslint node/no-process-exit: 0 */
  process.exit(-1);
}

const validations = require("../src/cli/validations.cjs");
const actions = require("../src/cli/actions.cjs");
const normalize = require("../src/cli/normalize.cjs");

function presentError(pError) {
  process.stderr.write(actions.formatError(pError));

  /* eslint no-process-exit:0 */
  process.exit(1);
}

try {
  program
    .version($package.version)
    .description(makeDescription(process.versions.node))
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
