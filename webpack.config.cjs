const path = require("path");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: path.join(__dirname, "./drainer/src/main.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devServer: {
    port: 3000,
    static: {
      directory: path.join(__dirname, "drainer", "public"),
    },
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Look for .js or .jsx files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // Use Babel to transpile JSX
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"], // Resolve these extensions
  },
};
