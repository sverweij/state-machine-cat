import getStream from "get-stream";
import prettier from "prettier";

// eslint-disable-next-line unicorn/prefer-top-level-await
getStream(process.stdin).then((pJSON: string): boolean =>
  process.stdout.write(
    prettier.format(`export default ${pJSON};`, { parser: "babel" })
  )
);
