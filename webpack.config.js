const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const dotenv = require("dotenv");

// Load .env variables into process.env
dotenv.config();

module.exports = (env = {}) => ({
  mode: env.development ? "development" : "production",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash].js",
    publicPath: "/",
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      { test: /\.[jt]sx?$/, exclude: /node_modules/, use: "babel-loader" },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "public/index.html" }),
    new webpack.DefinePlugin({
      "process.env.REACT_APP_API_URL": JSON.stringify(
        process.env.REACT_APP_API_URL || "http://localhost:3000"
      ),
      "process.env.REACT_APP_BASE_URL": JSON.stringify(
        process.env.REACT_APP_BASE_URL || "a"
      ),
      "process.env.REACT_APP_NODEMAILER_PASS": JSON.stringify(
        process.env.REACT_APP_NODEMAILER_PASS || "a"
      ),
      "process.env.REACT_APP_NODEMAILER_EMAIL": JSON.stringify(
        process.env.REACT_APP_NODEMAILER_EMAIL || "a"
      ),
    }),
  ],
  devServer: {
    static: path.resolve(__dirname, "dist"),
    historyApiFallback: true,
    port: 3002,
    open: true,
    hot: true,
  },
  devtool: env.development ? "eval-source-map" : "source-map",
});
