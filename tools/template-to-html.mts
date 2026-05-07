/* eslint-disable no-use-before-define */
/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { Readable } from "node:stream";
import { EOL } from "node:os";

function read(pInStream: Readable): Promise<string> {
  return new Promise((pResolve, pReject) => {
    let lInput = "";
    pInStream.resume();
    pInStream.setEncoding("utf8");
    pInStream.on("data", (pChunk) => {
      lInput += pChunk;
    });
    pInStream.on("end", () => {
      try {
        pInStream.pause();
        pResolve(lInput);
      } catch (pError) {
        pReject(pError);
      }
    });
    pInStream.on("error", (pError) => {
      pReject(pError);
    });
  });
}
function cutCookieFromTemplate(
  pTemplate: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pValues: Record<string, any>,
) {
  return pTemplate
    .split(EOL)
    .filter((pLine) => !pLine.match(/\{\{!--.+--\}\}/))
    .join(EOL)
    .replaceAll("{{title}}", pValues.title)
    .replaceAll("{{description}}", pValues.description)
    .replaceAll("{{social-media-image}}", pValues["social-media-image"])
    .replaceAll("{{site-name}}", pValues["site-name"])
    .replaceAll("{{canonical-url}}", pValues["canonical-url"])
    .replaceAll("{{loggingEnabled}}", pValues.loggingEnabled)
    .replaceAll("{{sourceFile}}", pValues.sourceFile)
    .replaceAll("{{materialTheme}}", pValues.materialTheme)
    .replaceAll("{{root}}", pValues.root)
    .replaceAll("{{background-color}}", pValues["background-color"])
    .replaceAll("{{SRIHash}}", pValues.SRIHash)
    .replaceAll("{{SRIHashMaterialCSS}}", pValues.SRIHashMaterialCSS)
    .replaceAll("{{SRIHashMaterialJS}}", pValues.SRIHashMaterialJS)
    .replaceAll("{{logScript}}", buildLogScript(pValues.loggingEnabled))
    .replaceAll("{{SRIHashLogScript}}", getSRIHash(buildLogScript(pValues.loggingEnabled)))
}

function buildLogScript(pLoggingEnabled: boolean) {
  return `let LOG = ${pLoggingEnabled};`
}

function getSRIHash(pString: string): string {
  const lHashFunction = crypto.createHash("sha512");
  const lHash = lHashFunction.update(pString).digest("base64");
  return `sha512-${lHash}`;
}

function getSRIHashForFile(pFileName: string): string {
  return getSRIHash(fs.readFileSync(pFileName, "utf8"));
}

const lValues = JSON.parse(
  fs.readFileSync(process.argv[process.argv.length - 1], "utf8"),
);
lValues.SRIHash = getSRIHashForFile(path.join("docs", lValues.sourceFile));
if (lValues.materialTheme) {
  lValues.SRIHashMaterialCSS = getSRIHashForFile(
    path.join("docs", lValues.materialTheme),
  );
}
lValues.SRIHashMaterialJS = getSRIHashForFile(
  path.join("docs", "vendor", "material.min.js"),
);

read(process.stdin)
  .then((pInput) => {
    process.stdout.write(cutCookieFromTemplate(pInput, lValues));
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch((pError) => process.stdout.write(`${pError}\n`));
