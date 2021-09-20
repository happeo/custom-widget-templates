const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = (env) => {
  const isProd = env.production;

  return {
    plugins: [new Dotenv()],
    entry: path.join(__dirname, "src", "index.js"),
    mode: isProd ? "production" : "development",
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
      contentBase: "./dist",
      hot: false,
      inline: true,
      liveReload: true,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    externals: [
      (_context, request, callback) => {
        if (/^@happeouikit/.test(request)) {
          // Resolve @happeoukit as externals in window
          return callback(null, [
            "Happeouikit",
            request.replace("@happeouikit/", ""),
          ]);
        }
        callback();
      },
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
