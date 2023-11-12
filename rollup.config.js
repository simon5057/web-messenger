const tsPlugin = require("@rollup/plugin-typescript");

module.exports = {
  input: {
    iframeMain: "src/entry/iframe/main/index.ts",
    iframeContentWindow: "src/entry/iframe/contentWindow/index.ts",
  },
  output: {
    dir: "dist",
    sourcemap: true,
  },
  plugins: [tsPlugin()],
};
