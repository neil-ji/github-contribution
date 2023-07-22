const path = require("path");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = function (env) {
  const isDev = env.dev;
  const isReport = env.report;
  const isTest = env.test;
  const isPublish = env.publish;

  let externalOptions = {};
  const plugins = [];
  const entry = {
    index: {
      import: "./src/index.ts",
    },
    // split run function as single chunk
    scripts: {
      import: "./src/scripts/index.ts",
      dependOn: "index", // remove shard dependencies
      library: {
        type: "commonjs2", // export run function as module.exports.run
      },
    },
  };

  // support dependencies analyze
  if (isReport) {
    plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: "server",
        analyzerHost: "127.0.0.1",
        analyzerPort: 9999,
        reportFilename: "report.html",
        openAnalyzer: true,
      })
    );
  }

  // test local function
  if (isTest) {
    entry.test = {
      import: "./src/test.ts",
      dependOn: "index",
    };
  }

  // remove external dependencies while publish
  if (isPublish) {
    externalOptions = {
      externals: ["arg", "cheerio", "signale"],
      externalsType: "commonjs",
      externalsPresets: {
        node: true,
      },
    };
  }

  return {
    ...externalOptions,
    mode: isDev ? "development" : "production",
    entry,
    target: "node", // prevent build node.js built-in module into output
    plugins,
    devtool: "inline-source-map", // offer semantic code information for users
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /.([cm]?ts|tsx)$/,
          loader: "ts-loader",
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      extensionAlias: {
        ".ts": [".js", ".ts"],
        ".cts": [".cjs", ".cts"],
        ".mts": [".mjs", ".mts"],
      },
    },
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
  };
};
