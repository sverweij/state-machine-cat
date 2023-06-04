import prettier from "prettier";

function getStream(pStream: NodeJS.ReadStream): Promise<string> {
  return new Promise((pResolve, pReject) => {
    let lInputAsString = "";

    pStream
      .on("data", (pChunk) => {
        lInputAsString += pChunk;
      })
      .on("error", pReject)
      .on("end", () => {
        pResolve(lInputAsString);
      });
  });
}

// eslint-disable-next-line unicorn/prefer-top-level-await
getStream(process.stdin).then((pJSON: string): boolean =>
  process.stdout.write(
    prettier.format(`export default ${pJSON};`, { parser: "babel" })
  )
);
