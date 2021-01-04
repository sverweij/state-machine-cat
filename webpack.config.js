module.exports = (pEnv = { prod: true }) => {
  const lRetval = {
    entry: "./docs/smcat-online-interpreter.js",
  };
  if (pEnv.prod === true) {
    lRetval.mode = "production";
    lRetval.output = {
      filename: `smcat-online-interpreter.min.js`,
      path: `${__dirname}/docs/`,
      pathinfo: true,
    };
    lRetval.devtool = "source-map";
  } else {
    lRetval.mode = "development";
    lRetval.output = {
      filename: `smcat-online-interpreter.bundle.js`,
      path: `${__dirname}/docs/dev/`,
      pathinfo: true,
    };
    lRetval.devtool = "source-map";
  }

  return lRetval;
};
