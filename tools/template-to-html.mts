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
  pValues: Record<string, string>
) {
  return pTemplate
    .split(EOL)
    .filter((pLine) => !pLine.match(/\{\{!--.+--\}\}/))
    .join(EOL)
    .replace(/\{\{title\}\}/g, pValues.title)
    .replace(/\{\{description\}\}/g, pValues.description)
    .replace(/\{\{social-media-image\}\}/g, pValues["social-media-image"])
    .replace(/\{\{site-name\}\}/g, pValues["site-name"])
    .replace(/\{\{canonical-url\}\}/g, pValues["canonical-url"])
    .replace("{{loggingEnabled}}", pValues.loggingEnabled)
    .replace("{{sourceFile}}", pValues.sourceFile)
    .replace("{{materialTheme}}", pValues.materialTheme)
    .replace(/\{\{trackingID\}\}/g, pValues.trackingID)
    .replace(
      "{{google-site-verification-key}}",
      pValues["google-site-verification-key"]
    )
    .replace(/\{\{root\}\}/g, pValues.root)
    .replace("{{background-color}}", pValues["background-color"])
    .replace("{{SRIHash}}", pValues.SRIHash);
}

function getSRIHash(pFileName: string): string {
  const lHashFunction = crypto.createHash("sha512");
  const lHash = lHashFunction
    .update(fs.readFileSync(pFileName, "utf8"))
    .digest("base64");
  return `sha512-${lHash}`;
}

const lValues = JSON.parse(
  fs.readFileSync(process.argv[process.argv.length - 1], "utf8")
);
lValues.SRIHash = getSRIHash(path.join("docs", lValues.sourceFile));

read(process.stdin)
  .then((pInput) => {
    process.stdout.write(cutCookieFromTemplate(pInput, lValues));
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch((pError) => process.stdout.write(`${pError}\n`));
