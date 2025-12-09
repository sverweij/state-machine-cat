/* eslint-disable security/detect-object-injection */
import prettier from "prettier";

function stripAttribute(pObject, pAttribute) {
  const lObject = structuredClone(pObject);
  delete lObject[pAttribute];

  for (const lKey of Object.keys(pObject)) {
    if (typeof pObject[lKey] === "object") {
      lObject[lKey] = stripAttribute(pObject[lKey], pAttribute);
    }
  }

  return lObject;
}
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
const lTheThingParsed = JSON.parse(lTheThing);
const lTheThingStringified = JSON.stringify(stripAttribute(lTheThingParsed, "description"));
const lTheFormattedThing = await prettier.format(`export default ${lTheThingStringified};`, { parser: "babel" });

process.stdout.write( lTheFormattedThing )
