const terser = require("@rollup/plugin-terser");
const tsPlugin = require("@rollup/plugin-typescript");

const dist = "dist";

module.exports = [
  {
    input: "src/index.ts",
    output: {
      dir: dist,
      sourcemap: true,
    },
    plugins: [tsPlugin()],
  },
  {
    input: "src/entry/iframe/main/index.ts",
    output: {
      name: "WebMessengerIframeMain",
      sourcemap: true,
      format: "umd",
      file: `${dist}/webMessenger-iframeMain.umd.js`,
    },
    plugins: [tsPlugin()],
  },
  {
    input: "src/entry/iframe/contentWindow/index.ts",
    output: {
      name: "WebMessengerIframeContentWindow",
      sourcemap: true,
      format: "umd",
      file: `${dist}/webMessenger-iframeContentWindow.umd.js`,
    },
    plugins: [tsPlugin()],
  },
  {
    input: "src/entry/iframe/main/index.ts",
    output: {
      name: "WebMessengerIframeMain",
      sourcemap: true,
      compact: true,
      format: "umd",
      file: `${dist}/webMessenger-iframeMain.umd.min.js`,
    },
    plugins: [tsPlugin(), terser()],
  },
  {
    input: "src/entry/iframe/contentWindow/index.ts",
    output: {
      name: "WebMessengerIframeContentWindow",
      sourcemap: true,
      compact: true,
      format: "umd",
      file: `${dist}/webMessenger-iframeContentWindow.umd.min.js`,
    },
    plugins: [tsPlugin(), terser()],
  },
];
