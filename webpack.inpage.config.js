const path = require("path");

module.exports = (pEnvironment = { prod: true }) => {
  const lReturnValue = {
    entry: path.join(__dirname, "docs", "state-machine-cat-inpage.js"),
  };

  if (pEnvironment.prod === true) {
    lReturnValue.mode = "production";
    lReturnValue.output = {
      filename: `state-machine-cat-inpage.min.js`,
      path: path.join(__dirname, "docs"),
    };
  } else {
    lReturnValue.mode = "development";
    lReturnValue.output = {
      filename: `state-machine-cat-inpage.bundle.js`,
      path: path.join(__dirname, "docs", "dev"),
    };
    lReturnValue.devtool = "source-map";
  }

  return lReturnValue;
};
