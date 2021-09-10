const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = (env) => {
  const isProd = env.production;
  return {
    entry: path.join(__dirname, "src", "index.ts"),
    mode: isProd ? "production" : "development",
    plugins: [
      new webpack.EnvironmentPlugin({ MOCK_WIDGET_SDK: true }),
      new HtmlWebPackPlugin({
        template: path.resolve(__dirname, "public/index.html"),
        filename: "index.html",
        inject: false,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react", "@babel/preset-env"],
            },
          },
        },
        {
          test: /\.js$/,
          use: "babel-loader",
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|j?g|svg|gif)?$/,
          use: "file-loader",
        },
      ],
    },
    devServer: {
      contentBase: "./dist",
      hot: false,
      inline: false,
    },
    resolve: {
      extensions: [".ts", ".ts", ".js"],
    },
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
  };
};
