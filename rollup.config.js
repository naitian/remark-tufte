import pkg from "./package.json";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
export default [
  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: "./src/remark-tufte.js",
    output: [
      {
        file: pkg.main,
        format: "cjs",
      },
      {
        file: pkg.module,
        format: "es",
      },
    ],
    plugins: [commonjs(), resolve()],
  },
];
