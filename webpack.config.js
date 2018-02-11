const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const OptimizeJsPlugin = require("optimize-js-plugin");

let env = process.env.NODE_ENV || "DEV";
let plugins = [
    new HtmlWebpackPlugin({
        template: "./client/src/index.html",
        filename: "index.html",
        inject: "body"
    })
];

if (env === "PROD") {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin(),
        new OptimizeJsPlugin({
            sourceMap: false
        })
    );
}

console.log("NODE_ENV:", env);

module.exports = {
    entry: "./client/src/index.js",
    output: {
        path: path.resolve(__dirname, "client/build"),
        filename: "app.bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            module: true
                        }
                    }
                ]
            },
            {
                test: /\.(scss)$/,
                use: [{
                    loader: 'style-loader', 
                }, {
                    loader: 'css-loader',
                }, {
                    loader: 'postcss-loader', 
                    options: {
                        plugins: function () {
                            return [
                                require('precss'),
                                require('autoprefixer')
                            ];
                        }
                    }
                }, {
                    loader: 'sass-loader'
                }]
            },
        ]
    },
    plugins
};
