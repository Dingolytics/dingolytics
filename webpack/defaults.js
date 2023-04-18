const path = require("path")
const webpack = require("webpack")
const { WebpackManifestPlugin } = require("webpack-manifest-plugin")
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const WebpackMiniCssPlugin = require("mini-css-extract-plugin")
const WebpackCopyPlugin = require("copy-webpack-plugin")
const WebpackHtmlPlugin = require("html-webpack-plugin")

const getApplicationPath = (name) => {
  return path.resolve(__dirname, "..", "./application/", name)
}

const getEnvironmentVar = (name, fallback) => {
  return JSON.stringify(process.env[name] || fallback || '')
}

const getPlugins = (env) => {
  return [
    new webpack.DefinePlugin({
      // "process.env.name": JSON.stringify(env),
      "process.env.NODE_ENV": JSON.stringify(env),
      "process.env.API_BASE_URL": getEnvironmentVar("API_BASE_URL"),
    }),

    (env === "production") &&
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled'
    }),

    new webpack.ContextReplacementPlugin(
      /moment[\/\\]locale$/, /en|es|de|fr/
    ),

    new WebpackHtmlPlugin({
      template: getApplicationPath("index.html")
    }),

    new WebpackManifestPlugin({
      fileName: "asset-manifest.json",
      publicPath: ""
    }),

    new WebpackCopyPlugin({
      patterns: [
        "application/assets/robots.txt",
        "application/unsupported.html",
        "application/unsupported.js",
        {
          from: "application/assets/css/**/*.css",
          to: "styles/[name][ext]"
        },
        // {
        //   from: "application/assets/fonts",
        //   to: "fonts/"
        // }
      ]
    }),

    (env === "production") &&
    new WebpackMiniCssPlugin({
      filename: "[name].[chunkhash].css"
    }),
  ].filter(Boolean)
}

const getRules = (env) => {
  return [
    // Use "babel-loader" for all *.ts, *.js, *.tsx, and *.jsx files
    {
      test: /\.(ts|js)x?$/,
      exclude: /node_modules/,
      use: ["babel-loader"],
    },

    // Use "style-loader" and "css-loader" for all *.css files
    {
      test: /\.css$/,
      use: [
        (
          (env === "production") ?
          WebpackMiniCssPlugin.loader :
          "style-loader"
        ),
        "css-loader"
      ],
    },

    // Use "less-loader" for all *.less files
    {
      test: /\.less$/,
      use: [
        (
          (env === "production") ?
          WebpackMiniCssPlugin.loader :
          "style-loader"
        ),
        "css-loader",
        {
          loader: "less-loader",
          options: {
            lessOptions: {
              javascriptEnabled: true,
            }
          },
        },
      ],
    },

    // Babel v5+ supports image loaders out of the box
    {
      test: /\.(?:gif|png|jpg|jpeg|svg)$/i,
      type: "asset/resource",
    },
    {
      test: /\.(woff(2)?|eot|ttf|otf|)$/,
      type: "asset/inline",
    },
  ]
}

module.exports = {
  getApplicationPath,
  getEnvironmentVar,
  getPlugins,
  getRules,
}
