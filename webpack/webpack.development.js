// const webpack = require("webpack")
const defaults = require("./defaults")

const staticPaths = /^\/static\/.+\.(css|js|gif|png|jpg|jpeg|svg)$/

const redashBackend = "http://127.0.0.1:5000"

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  plugins: [
    ...defaults.getPlugins("development")
  ],
  module: {
    rules: [
      ...defaults.getRules("development")
    ]
  },
  optimization: {
    usedExports: true
  },
  devServer: {
    // Just open manually http://127.0.0.1:8080
    open: false,

    // Serve "index.html" after page refresh:
    historyApiFallback: true,

    // Proxy specific requests to back-end API
    proxy: [
      {
        context: [
          "/login",
          "/logout",
          "/invite",
          "/setup",
          "/status.json",
          "/api/",
          "/oauth/",
          "/ext/"
        ],
        target: redashBackend + "/",
        changeOrigin: false,
        secure: false
      },
      // Static CSS / JS / images from application server
      {
        context: (path) => staticPaths.test(path),
        target: redashBackend + "/",
        changeOrigin: false,
        secure: false
      }
    ],

    // Enable live reload and hot module replacement
    liveReload: true,
    hot: true,
  },
}
