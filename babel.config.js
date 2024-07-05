export default {
  presets: [],
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: false }],
    "babel-plugin-transform-typescript-metadata",
    "babel-plugin-parameter-decorator",
  ],
  env: {
    development: {
      plugins: [
        [
          "babel-plugin-styled-components",
          {
            displayName: true,
          },
        ],
      ],
    },
    production: {
      plugins: [
        [
          "babel-plugin-styled-components",
          {
            displayName: false,
          },
        ],
      ],
    },
  },
};
