const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const WebpackMonitor = require('webpack-monitor');

module.exports = {
    entry: './docs/smcat-online-interpreter.js',
    output: {
        filename: './docs/smcat-online-interpreter.min.js'
    },
    plugins: [
        new UglifyJsPlugin(),
        new WebpackMonitor({
            capture: true,
            launch: false
        })
    ]
};
