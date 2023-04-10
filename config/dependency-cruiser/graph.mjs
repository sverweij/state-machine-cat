import baseConfig from "./base.mjs";

/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  ...baseConfig,
  options: {
    ...baseConfig.options,
    cache: "node_modules/.cache/dependency-cruiser/graph",
    includeOnly: "^(bin|src)/",
    reporterOptions: {
      archi: {
        collapsePattern: "^(bin|src/(cli|transform|[^/]+/[^/]+))",
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
              criteria: { source: "\\.(js|ts)$" },
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
                source: "(-parser|\\.template|\\.schema|version)\\.m?js$",
              },
              attributes: { style: "filled", color: "gray" },
            },
            {
              criteria: { source: "\\.json$" },
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
