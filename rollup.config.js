import tsPlugin from "@rollup/plugin-typescript";

export default {
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
