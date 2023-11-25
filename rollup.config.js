const terser = require("@rollup/plugin-terser");
const tsPlugin = require("@rollup/plugin-typescript");

const IS_PROD = process.env.ENV === "prod";
const dist = IS_PROD ? "." : "dist";

module.exports = [
  {
    input: {
      iframeMain: "src/entry/iframe/main/index.ts",
      iframeContentWindow: "src/entry/iframe/contentWindow/index.ts",
    },
    output: {
      dir: dist,
      sourcemap: true,
    },
    plugins: [tsPlugin()],
  },
  {
    input: "src/entry/iframe/main/index.ts",
    output: {
      name: "WebMessengerMain",
      sourcemap: true,
      format: "iife",
      file: `${dist}/webMessenger-iframeMain.iife.js`,
    },
    plugins: [tsPlugin()],
  },
  {
    input: "src/entry/iframe/contentWindow/index.ts",
    output: {
      name: "WebMessengerContentWindow",
      sourcemap: true,
      format: "iife",
      file: `${dist}/webMessenger-iframeContentWindow.iife.js`,
    },
    plugins: [tsPlugin()],
  },
  {
    input: "src/entry/iframe/main/index.ts",
    output: {
      name: "WebMessengerMain",
      sourcemap: true,
      compact: true,
      format: "iife",
      file: `${dist}/webMessenger-iframeMain.iife.min.js`,
    },
    plugins: [tsPlugin(), terser()],
  },
  {
    input: "src/entry/iframe/contentWindow/index.ts",
    output: {
      name: "WebMessengerContentWindow",
      sourcemap: true,
      compact: true,
      format: "iife",
      file: `${dist}/webMessenger-iframeContentWindow.iife.min.js`,
    },
    plugins: [tsPlugin(), terser()],
  },
];
