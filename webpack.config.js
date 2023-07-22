const path = require("path");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = function (env) {
  const isDev = env.dev;
  const isReport = env.report;
  const plugins = [];
  if (isReport) {
    plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: "server", // 默认值：server，共有server，static，json，disabled四种模式
        analyzerHost: "127.0.0.1", // 默认值：127.0.0.1，在server模式下使用的主机启动HTTP服务器。
        analyzerPort: 9999, // 默认值：8888，在server模式下使用的端口号
        reportFilename: "report.html", // 默认值：report.html，在static模式下生成的捆绑报告文件的路径名
        openAnalyzer: true, // 默认值：true，是否在默认浏览器中自动打开报告
      })
    );
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
    entry: ["./src/index.ts", "./src/run.ts"],
    target: "node",
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
          options: {
            transpileOnly: true,
          },
        },
      ],
    },
    // devtool: "inline-source-map",
  };
};
