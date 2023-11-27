const terser = require("@rollup/plugin-terser");
const tsPlugin = require("@rollup/plugin-typescript");

const dist = "dist";

function genUMDOutputConfig(input, outputName, fileName, compact) {
  const config = {
    input,
    output: {
      name: outputName,
      sourcemap: true,
      format: "umd",
      file: `${dist}/${fileName}.umd${compact ? ".min" : ""}.js`,
    },
    plugins: [tsPlugin()],
  };
  if (compact) {
    config.output.compact = true;
    config.plugins.push(terser());
  }
  return config;
}

module.exports = [
  {
    input: "src/index.ts",
    output: {
      dir: dist,
      sourcemap: true,
    },
    plugins: [tsPlugin()],
  },
  genUMDOutputConfig(
    "src/entry/iframe/main/index.ts",
    "WebMessengerIframeMain",
    "webMessenger-iframeMain"
  ),
  genUMDOutputConfig(
    "src/entry/iframe/contentWindow/index.ts",
    "WebMessengerIframeContentWindow",
    "webMessenger-iframeContentWindow"
  ),
  genUMDOutputConfig(
    "src/entry/iframe/main/index.ts",
    "WebMessengerIframeMain",
    "webMessenger-iframeMain",
    true
  ),
  genUMDOutputConfig(
    "src/entry/iframe/contentWindow/index.ts",
    "WebMessengerIframeContentWindow",
    "webMessenger-iframeContentWindow",
    true
  ),
];
