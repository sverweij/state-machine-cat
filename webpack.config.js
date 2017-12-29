const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (pEnv = 'prod') => {
    const lRetval = {
        entry: './docs/smcat-online-interpreter.js'
    };

    if (pEnv === 'prod') {
        lRetval.output = {filename : './docs/smcat-online-interpreter.min.js'};
        lRetval.plugins = [
            new UglifyJsPlugin({
                sourceMap: false
            })
        ];
    } else {
        lRetval.output = {filename : './docs/dev/smcat-online-interpreter.bundle.js'};
        lRetval.devtool = "source-map";
    }

    return lRetval;
};
