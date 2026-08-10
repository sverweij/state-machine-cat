import type { IConfiguration } from "dependency-cruiser";
import baseConfig from "./base.mts";

const lConfiguration: IConfiguration = {
  ...baseConfig,
  options: {
    ...baseConfig.options,
    cache: "node_modules/.cache/dependency-cruiser/graph",
    includeOnly: "^src/",
    reporterOptions: {
      archi: {
        collapsePattern: "^(src/(cli|transform|[^/]+/[^/]+))",
      },
      dot: {
        theme: {
          graph: { splines: "ortho", ranksep: "0.5" },
          modules: [
            {
              criteria: { matchesHighlight: true },
              attributes: {
                fillcolor: "yellow",
                color: "green",
                penwidth: 2,
              },
            },
            {
              criteria: { source: "[.](js|ts)$" },
              attributes: { color: "transparent" },
            },
            {
              criteria: { source: "^src/cli" },
              attributes: { fillcolor: "#ccffcc" },
            },
            {
              criteria: { source: "^src/parse" },
              attributes: { fillcolor: "#ffccff" },
            },
            {
              criteria: { source: "^src/render" },
              attributes: { fillcolor: "#ccccff" },
            },
            {
              criteria: {
                source: "(-parser|[.]template|[.]schema|version)[.]m?js$",
              },
              attributes: { style: "filled", color: "gray" },
            },
            {
              criteria: { source: "[.]json$" },
              attributes: { shape: "cylinder" },
            },
          ],
          dependencies: [
            {
              criteria: { resolved: "^src/cli" },
              attributes: { color: "#00770077" },
            },
            {
              criteria: { resolved: "^src/parse" },
              attributes: { color: "#ff00ff77" },
            },
            {
              criteria: { resolved: "^src/render" },
              attributes: { color: "#0000ff77" },
            },
          ],
        },
      },
    },
  },
};

export default lConfiguration;