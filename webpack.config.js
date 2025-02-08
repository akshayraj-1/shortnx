const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const glob = require("glob");

module.exports = (env, argv) => {
    const isProduction = argv.mode === "production";

    const entries = glob.sync("./src/js/**/*.js").reduce((acc, filepath) => {
        const entryName = path.relative('./src/js', filepath).replace(/\\/g, '/').replace(/\.js$/, '');
        acc[entryName] = path.resolve(filepath);
        return acc;
    }, {});

    return {
        entry: entries,
        output: {
            path: path.resolve(__dirname, "public/js"),
            filename: isProduction ? "[name].min.js" : "[name].js",
            clean: true,
        },
        mode: isProduction ? "production" : "development",
        watch: !isProduction,
        optimization: {
            minimize: isProduction,
            usedExports: true,
            minimizer: [new TerserPlugin({
                terserOptions: {
                    mangle: {
                        toplevel: true,
                        properties: {
                            regex: /^_/,
                        },
                    },
                    format: {
                        comments: false,
                        beautify: false
                    },
                    compress: {
                        drop_console: false,
                        drop_debugger: true,
                        passes: 5,
                        booleans: true,
                        conditionals: true,
                        sequences: true,
                        unused: true,
                        collapse_vars: true,
                        dead_code: true,
                        reduce_vars: true,
                    }
                },
                extractComments: false
            })],
        },
        devtool: isProduction ? false : "source-map",
        module: {
            rules: [
                // Add loaders here if you need to handle other file types (e.g., Babel for ES6)
            ],
        },
        resolve: {
            extensions: [".js"],
        },
    };
};
