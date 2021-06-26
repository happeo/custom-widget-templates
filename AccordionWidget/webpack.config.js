const path = require("path");

module.exports = (env) => {
  const isProd = env.production;

  return {
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
        {
          test: /\.css$/,
          use: [
            { loader: "react-web-component-style-loader" },
            { loader: "css-loader" },
          ],
        },
      ],
    },
    devServer: {
      contentBase: "./dist",
      hot: false,
      inline: false,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    externals: {
      react: "React",
      "react-dom": "ReactDOM",
      "styled-components": "styled",
      jQuery: "jQuery",
      "@happeouikit/alerts": ["Happeouikit", "alerts"],
      "@happeouikit/avatar": ["Happeouikit", "avatar"],
      "@happeouikit/banners": ["Happeouikit", "banners"],
      "@happeouikit/buttons": ["Happeouikit", "buttons"],
      "@happeouikit/card": ["Happeouikit", "card"],
      "@happeouikit/colors": ["Happeouikit", "colors"],
      "@happeouikit/content-renderer": ["Happeouikit", "content-renderer"],
      "@happeouikit/copy-to-clipboard-button": [
        "Happeouikit",
        "copy-to-clipboard-button",
      ],
      "@happeouikit/emojis": ["Happeouikit", "emojis"],
      "@happeouikit/file-icon": ["Happeouikit", "file-icon"],
      "@happeouikit/file-picker": ["Happeouikit", "file-picker"],
      "@happeouikit/form-elements": ["Happeouikit", "form-elements"],
      "@happeouikit/icons": ["Happeouikit", "icons"],
      "@happeouikit/image-grid": ["Happeouikit", "image-grid"],
      "@happeouikit/layout": ["Happeouikit", "layout"],
      "@happeouikit/list": ["Happeouikit", "list"],
      "@happeouikit/loaders": ["Happeouikit", "loaders"],
      "@happeouikit/menus": ["Happeouikit", "menus"],
      "@happeouikit/modals": ["Happeouikit", "modals"],
      "@happeouikit/navigation": ["Happeouikit", "navigation"],
      "@happeouikit/theme": ["Happeouikit", "theme"],
      "@happeouikit/toast": ["Happeouikit", "toast"],
      "@happeouikit/tooltip": ["Happeouikit", "tooltip"],
      "@happeouikit/typography": ["Happeouikit", "typography"],
    },
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
  };
};
