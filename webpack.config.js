const path = require("path");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = function (env) {
  const isDev = env.dev;
  const isReport = env.report;
  const isTest = env.test;
  const isPublish = env.publish;

  const plugins = [];
  const externals = [];
  const entry = {
    index: {
      import: "./src/index.ts",
    },
    run: {
      import: "./src/script.ts",
      dependOn: "index",
    },
  };

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
  if (isTest) {
    entry.test = {
      import: "./src/test.ts",
      dependOn: "index",
    };
  }
  if (isPublish) {
    externals.push("arg", "cheerio", "signale");
  }

  return {
    mode: isDev ? "development" : "production",
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      extensionAlias: {
        ".ts": [".js", ".ts"],
        ".cts": [".cjs", ".cts"],
        ".mts": [".mjs", ".mts"],
      },
    },
    entry,
    target: "node",
    externals,
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    plugins,
    module: {
      rules: [
        {
          test: /.([cm]?ts|tsx)$/,
          loader: "ts-loader",
          // options: {
          //   transpileOnly: true,
          // },
        },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
    devtool: "source-map",
  };
};
