/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { Readable } from "node:stream";
import handlebars from "handlebars";

function read(pInStream: Readable) {
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
function cutCookieFromTemplate(pTemplate, pValues) {
  const lCompiledTemplate = handlebars.compile(pTemplate);
  return lCompiledTemplate(pValues);
}

function getSRIHash(pFileName: string): string {
  const lHashThing = crypto.createHash("sha512");
  return `sha512-${lHashThing
    .update(fs.readFileSync(pFileName, "utf8"))
    .digest("base64")}`;
}

const lValues = JSON.parse(
  fs.readFileSync(process.argv[process.argv.length - 1], "utf8")
);
lValues.SRIHash = getSRIHash(path.join("docs", lValues.interpreterSourceFile));

read(process.stdin)
  .then((pInput) => {
    process.stdout.write(cutCookieFromTemplate(pInput, lValues));
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch((pError) => process.stdout.write(`${pError}\n`));
