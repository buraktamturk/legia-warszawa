
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: '#source-map',
    context: __dirname,
    optimization: {
        splitChunks: {
            cacheGroups: {
                default: false,
                commons: {
                    test: /node_modules/,
                    name: "vendor",
                    chunks: "initial",
                    minSize: 1
                }
            }
        },
        sideEffects: false
    },
    entry: {
        javascript: './src/main.js'
    },
    resolve: {
        symlinks: false
    },
    devServer: {
    },
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "",
        filename: "[name]-[hash].js",
        chunkFilename: "[name]-[chunkhash].js",
        hotUpdateMainFilename: "[hash]/update.json",
        hotUpdateChunkFilename: "[hash]/js/[id].update.js"
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|svg|eot|woff|ttf?)(.*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.css$/,
                use: [
                  'style-loader',
                  'css-loader'
                ]
            },
            {
                test: /\.html$/,
                exclude: /(node_modules|bower_components)/,
                loader: "html-loader?attrs[]=source:src&attrs[]=img:src&attrs[]=section:data-image-src"
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            'window.jQuery': 'jquery',
            jQuery: 'jquery',
            $: 'jquery'
        }),
        new HtmlWebpackPlugin({
            template: 'index.ejs',
            inject: 'body',
            filename: 'index.html'
        }),
        new webpack.DefinePlugin({
            DEBUG: true,
            ENDPOINT: '"https://api.vidimake.com"'
        })
    ]
};
