import { defineConfig } from "orval";

export default defineConfig({
  all: {
    input: "./swagger.json",
    output: {
      tsconfig: "tsconfig.json",
      mode: "tags",
      target: "src/gen/",
      schemas: "src/gen/dto",
      client: "axios",
      mock: false,
      override: {
        mutator: {
          path: "./src/api/axios.ts",
          name: "axiosInstancePromise",
        },
      },
    },
    hooks: {
      afterAllFilesWrite: ["prettier --write", "eslint --fix --ext .ts"],
    },
  },
});
