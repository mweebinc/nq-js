const path = require('path')
const NodePolyFill = require('node-polyfill-webpack-plugin')

module.exports = {
    mode : 'production',
    entry : './src/index.js',
    plugins: [new NodePolyFill],
    devServer: {
        port : 80
    },
    output : {
        path : path.resolve(__dirname, './dist'),
        filename : 'app.bundle.js',
        library : 'NQ',
        libraryTarget: 'umd',
        globalObject: 'this',
    },
    module : {
        rules : [{
            test : /\.js$/,
            exclude: /(node_modules)/,
            use : 'babel-loader'
        }]
    }
}