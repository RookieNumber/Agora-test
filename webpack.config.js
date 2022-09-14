const path = require("path");

module.exports = {
    entry: "./index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "./dist"),
    },
    devServer: {
        hot: true,
        compress: true,
        port: 9000,
    },
    module: {
        rules: [
          {
            test: /\.s[ac]ss$/i,
            use: [
              // Creates `style` nodes from JS strings
              "style-loader",
              // Translates CSS into CommonJS
              "css-loader",
              // Compiles Sass to CSS
              "sass-loader",
            ],
          },
        ],
      },
};