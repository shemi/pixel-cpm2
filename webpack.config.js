var path = require("path");
var webpack = require("webpack");

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    resolve: {
        root: [path.join(__dirname, "/public/bower_components")],
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ),
        new webpack.ProvidePlugin({ "_": "underscore" }),
        new ExtractTextPlugin("css/style.css"),
        new webpack.optimize.CommonsChunkPlugin('common.js')
    ],
    entry:  {
        preAuth: './public/pre_auth/js/pre.auth.app.js',
        main: './public/app.js'
    },
    output: {
        path: path.join(__dirname, "public"),
        filename: "[name].bundle.js",
        chunkFilename: "[id].chunk.js"
    },
    watch: true,
    devtool: 'source-map-inline',
    module:{
        loaders:[
            //{
            //    test: /\.scss$/,
            //    loader: ExtractTextPlugin.extract(
            //        'style-loader',
            //        'css-loader?sourceMap!' +
            //        'sass-loader?outputStyle=expanded&sourceMap=true&sourceMapContents=true'
            //    )
            //},
            //{test: /\.css/, loader: 'css-loader!autoprefixer-loader'},
            {test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000'},
            {test: /\.html$/, loader: 'raw'},
            {test: /\.json$/, loader: 'raw'}
        ]
    }
    
};