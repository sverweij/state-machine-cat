module.exports = {
  extends: "./dependency-cruiser",
  options: {
    includeOnly: "^(bin|src|package\\.json)",
    prefix: "https://github.com/sverweij/state-machine-cat/blob/develop/",
    reporterOptions: {
      archi: {
        collapsePattern: "^(bin|src/(cli|transform|[^/]+/[^/]+))"
      },
      dot: {
        theme: {
          graph: { splines: "ortho", ranksep: "0.5" },
          modules: [
            {
              criteria: { source: "^src/cli" },
              attributes: { fillcolor: "#ccffcc" }
            },
            {
              criteria: { source: "^src/parse" },
              attributes: { fillcolor: "#ffccff" }
            },
            {
              criteria: { source: "^src/render" },
              attributes: { fillcolor: "#ccccff" }
            },
            {
              criteria: { source: "(-parser|\\.template)\\.js$" },
              attributes: { style: "filled" }
            },
            {
              criteria: { source: "\\.json$" },
              attributes: { shape: "cylinder" }
            }
          ],
          dependencies: [
            {
              criteria: { resolved: "^src/cli" },
              attributes: { color: "#00770077" }
            },
            {
              criteria: { resolved: "^src/parse" },
              attributes: { color: "#ff00ff77" }
            },
            {
              criteria: { resolved: "^src/render" },
              attributes: { color: "#0000ff77" }
            }
          ]
        }
      }
    }
  }
};
