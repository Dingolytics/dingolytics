// const webpack = require("webpack")
const defaults = require("./defaults")

module.exports = {
  mode: "production",
  devtool: "source-map",
  plugins: [
    ...defaults.getPlugins("production")
  ],
  module: {
    rules: [
      ...defaults.getRules("production")
    ]
  },
  optimization: {
    concatenateModules: false,
    usedExports: true,
    runtimeChunk: 'single'
  }
}
