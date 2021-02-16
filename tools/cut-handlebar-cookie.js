/* eslint-disable security/detect-non-literal-fs-filename */
const fs = require("fs");
const handlebars = require("handlebars");

function read(pInStream) {
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

read(process.stdin)
  .then((pInput) => {
    process.stdout.write(
      cutCookieFromTemplate(
        pInput,
        JSON.parse(
          fs.readFileSync(process.argv[process.argv.length - 1], "utf8")
        )
      )
    );
  })
  .catch((pError) => process.stdout.write(`${pError}\n`));
