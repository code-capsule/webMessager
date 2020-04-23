/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');

module.exports = options => ({
    mode: options.mode,
    entry: options.entry,
    output: Object.assign({
            // Compile into js/build.js
            path: path.resolve(process.cwd(), 'build'),
            publicPath: '/',
        },
        options.output,
    ), // Merge with env dependent settings
    optimization: options.optimization,
    module: {
        rules: [
            {
                test: /\.js?$/, // Transform all .js and .jsx files required somewhere with Babel
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        // presets: [
                        //     ["@babel/preset-env", {
                        //         "targets": {
                        //             "browsers": [">0.25%", "ie > 10"]
                        //         },
                        //     }],
                        //     // "@babel/typescript"
                        // ],
                        plugins: ['@babel/plugin-transform-runtime','@babel/plugin-syntax-dynamic-import'],
                    },
                },
            },
            {
                test: /\.html$/,
                use: 'html-loader',
            },
        ],
    },
    plugins: options.plugins.concat([
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development',
        }),
    ]),
    resolve: {
        modules: ['node_modules', 'app'],
        extensions: ['.js', '.jsx', '.react.js', '.ts', '.tsx'],
        // mainFields: ['browser', 'jsnext:main', 'main'],
        // alias: {
        //     '@easiclass/web-service': path.join(
        //         process.cwd(),
        //         '..',
        //         'packages/webService/dist/index.js',
        //     ),
        //     '@easiclass/easiclass-web-service': path.join(
        //         process.cwd(),
        //         '..',
        //         'packages/eclass-web-service/dist/index.js',
        //     ),
        // },
    },
    devtool: options.devtool,
    devServer: options.devServer,
    target: 'web', // Make web variables accessible to webpack, e.g. window
    performance: options.performance || {},
});
