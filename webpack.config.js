const path = require("path");

module.exports = function (env) {
  const isDev = env.dev;
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
    entry: "./src/index.ts",
    output: {
      filename: "github-contribution.js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
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
    devtool: "inline-source-map",
  };
};
