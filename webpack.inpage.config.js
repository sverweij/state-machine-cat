module.exports = (pEnv = 'prod') => {
    const lRetval = {
        entry: `${__dirname}/docs/state-machine-cat-inpage.js`
    };

    if (pEnv === 'prod') {
        lRetval.mode = 'production';
        lRetval.output = {
            filename : `state-machine-cat-inpage.min.js`,
            path : `${__dirname}/docs/`
        };
    } else {
        lRetval.mode = 'development';
        lRetval.output = {
            filename : `state-machine-cat-inpage.bundle.js`,
            path : `${__dirname}/docs/dev`
        };
        lRetval.devtool = "source-map";
    }

    return lRetval;
};
