const path = require("path");
const webpack = require("webpack");

module.exports = (env) => {
  const isProd = env.production;

  return {
    entry: path.join(__dirname, "src", "index.js"),
    mode: isProd ? "production" : "development",
    plugins: [new webpack.EnvironmentPlugin({ MOCK_WIDGET_SDK: false })],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
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
      ],
    },
    devServer: {
      static: {
        directory: "./dist",
      },
      hot: false,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    externals: [
      {
        react: "React",
        "react-dom": "ReactDOM",
        "styled-components": "styled",
        jQuery: "jQuery",
      },
    ],
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
  };
};
