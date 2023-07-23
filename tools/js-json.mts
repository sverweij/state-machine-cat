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

const lTheThing = await getStream(process.stdin);
const lTheFormattedThing = await prettier.format(`export default ${lTheThing};`, { parser: "babel" });

process.stdout.write( lTheFormattedThing )
