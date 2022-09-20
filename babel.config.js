module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: { node: 8 },
      },
    ],
  ],
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        regenerator: false,
        version: require("@babel/runtime/package.json").version,
      },
    ],
  ],
  overrides: [{ test: "**/*.ts", presets: ["@babel/preset-typescript"] }],
};
