import { writeFileSync } from "node:fs";
import Ajv from "ajv";
import standaloneCode from "ajv/dist/standalone/index.js";

const ajv = new Ajv({ code: { source: true, esm: true } });

if (process.argv.length === 4) {
  const lInputSchemaFileName = process.argv[2];
  const lOutputFileName = process.argv[3];

  const lSchema = await import(`../${lInputSchemaFileName}`);
  const validate = ajv.compile(lSchema.default);

  const lModuleCode = standaloneCode(ajv, validate);

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  writeFileSync(lOutputFileName, lModuleCode, "utf8");
} else {
  process.exitCode = 1;
  process.stderr.write(
    `\nUsage: generate-schema-validator.utl.mjs input-schema.mjs output-validator.mjs\n\n  e.g. generate-schema-validator.utl.mjs ./src/parse/smcat-ast.schema.mjs ./src/parse/smcat-ast.validate.mjs\n\n`,
  );
}
