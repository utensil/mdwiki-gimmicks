var webpack = require('webpack');

module.exports = [{
    context: __dirname + "/lib",
    resolve: {
        root: __dirname,
        //modulesDirectories: ["web_modules", "node_modules"],
        extensions: ["", ".webpack.js", ".web.js", ".coffee", ".js"],
        alias: {
            //'vendor': "./vendor/vendor.min.js"
            'process_wb': __dirname + "/lib/xls-preview/old_imp/xlsutils"
        }
    },
    entry: {
        "xls-preview": "./xls-preview/entry",
    },
    output: {
        libraryTarget: "var",
        path: __dirname + "/dist",
        filename: "[name].js"
    },
    module: {
        loaders: [
            { test: /\.coffee$/, loader: "coffee-loader" },
            { test: /\.css$/, loader: "style!css" }
        ]
    },
    // node: {
    //     __filename: true,
    //     __dirname: true
    // },   
    externals: [
        {
            "httpinvoke": "httpinvoke",
            "jquery": "jQuery"
        }
    ],
    target: 'web',
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
            //_: "lodash"
        }),
        //new webpack.optimize.UglifyJsPlugin(),
        // new webpack.optimize.OccurenceOrderPlugin(),
        // new webpack.optimize.DedupePlugin(),
        new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1, minChunkSize: 10000}),
        //new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js")
    ]
},
{
    context: __dirname + "/lib",
    resolve: {
        root: __dirname,
        //modulesDirectories: ["web_modules", "node_modules"],
        extensions: ["", ".webpack.js", ".web.js", ".coffee", ".js"],
        alias: {
            //'vendor': "./vendor/vendor.min.js"
        }
    },
    entry: {
        "xls-preview-webworker": "./xls-preview/webworker-entry",
    },
    output: {
        libraryTarget: "var",
        path: __dirname + "/dist",
        filename: "[name].js"
    },
    module: {
        loaders: [
            { test: /\.coffee$/, loader: "coffee-loader" },
            { test: /\.css$/, loader: "style!css" }
        ]
    },
    // node: {
    //     __filename: true,
    //     __dirname: true
    // },   
    externals: [
        {
            //"window": "window"
        }
    ],
    target: 'webworker',
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            _: "lodash"
        }),
        //new webpack.optimize.UglifyJsPlugin(),
        // new webpack.optimize.OccurenceOrderPlugin(),
        // new webpack.optimize.DedupePlugin(),
        new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1, minChunkSize: 10000}),
        //new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js")
    ]
}];