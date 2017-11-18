const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './docs/smcat-online-interpreter.js',
    output: {
        filename: './docs/smcat-online-interpreter.min.js'
    },
    plugins: [
        new UglifyJsPlugin()
    ]
};
