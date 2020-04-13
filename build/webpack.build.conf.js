const path = require('path');

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        index: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'util-upload.js',
        library: 'Upload',
        libraryExport: 'default',
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    externals: {
        axios: {
            commonjs: 'axios',
            commonjs2: 'axios',
            amd: 'axios',
            root: 'axios'
        }
    },
    devtool: 'cheap-moduel-source-map',
    mode: 'production'
}