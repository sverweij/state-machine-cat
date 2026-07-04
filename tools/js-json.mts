import { format } from "prettier";

// oxlint-disable-next-line no-explicit-any
function stripAttribute(pObject: any, pAttribute: string): string {
  const lObject = structuredClone(pObject);
  // oxlint-disable-next-line no-dynamic-delete
  delete lObject[pAttribute];

  for (const lKey of Object.keys(pObject)) {
    if (typeof pObject[lKey] === "object" && pObject[lKey] !== null) {
      lObject[lKey] = stripAttribute(pObject[lKey], pAttribute);
    }
  }

  return lObject;
}
function getStream(pStream: NodeJS.ReadStream): Promise<string> {
  return new Promise((pResolve, pReject) => {
    let lInputAsString = "";

    pStream
      .on("data", (pChunk: string) => {
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
const lTheThingStringified = JSON.stringify(
  stripAttribute(lTheThingParsed, "description"),
);
const lTheFormattedThing = await format(
  `export default ${lTheThingStringified};`,
  { parser: "babel" },
);

process.stdout.write(lTheFormattedThing);
