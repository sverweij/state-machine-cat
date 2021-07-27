import getStream from "get-stream";
import prettier from "prettier";

getStream(process.stdin).then((pJSON) =>
  process.stdout.write(
    prettier.format(`export default ${pJSON};`, { parser: "babel" })
  )
);
