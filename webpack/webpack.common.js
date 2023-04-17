const path = require("path")

const applicationRoot = path.resolve(__dirname, "..", "./application")
const extensionsRoot = path.resolve(__dirname, "..", "./extensions")
const lodashLibsRoot = path.resolve(applicationRoot, "./lib", "lodash.ts")
const redashLibsRoot = path.resolve(applicationRoot, "./redash-libs")
const buildRoot = path.resolve(__dirname, "..", "./build")

module.exports = {
  entry: {
    application: {
      import: [
        path.resolve(applicationRoot, "./index.tsx"),
        path.resolve(applicationRoot, "./assets", "./styles.less"),
        path.resolve(applicationRoot, "./assets", "./less", "./ant.less")
      ],
      dependOn: ["_ace"],
      // TODO: This is not working as-is
      // dependOn: ["_ace", "_leaflet"]
    },
    _ace: ["ace-builds"],
    // _leaflet: ["leaflet"],
  },
  resolve: {
    symlinks: true,
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      "@": applicationRoot,
      "@lodash": lodashLibsRoot,
      "@redash": redashLibsRoot,
      "extensions": extensionsRoot,
    },
    // BREAKING CHANGE: webpack < 5 used to include polyfills for
    // Node.js core modules by default. This is no longer the case.
    // Verify if you need this module and configure a polyfill for it.
    fallback: {
      "util": require.resolve("util/"),
      "url": require.resolve("url/")
    }
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: chunk => true
  //   }
  // },
  output: {
    path: buildRoot,
    filename: "[name].[chunkhash].js",
    clean: true,
    // Old "file-loader" config: [path][name].[ext]
    // assetModuleFilename: 'images/[name][ext][query]',
    assetModuleFilename: (pathData) => {
      const basepath = (
        path.dirname(pathData.filename).split("/").slice(2).join("/")
      )
      //throw new Error(basepath)
      return `${basepath}/[name][ext][query]`;
    },
  },
}
