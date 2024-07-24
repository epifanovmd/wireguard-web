import mdx from "@mdx-js/rollup";
// @ts-ignore
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import path from "path";
import { UserConfig } from "vite";
import { cjsInterop } from "vite-plugin-cjs-interop";

const projectRootDir = path.resolve(__dirname);

dotenv.config({ path: [`.env.${process.env.NODE_ENV}`, ".env"] });

const base_url = process.env.VITE_BASE_URL;

const config: UserConfig = {
  plugins: [
    TanStackRouterVite(),
    react({
      babel: {
        configFile: true,
      },
    }),
    mdx(),
    cjsInterop({
      // List of CJS dependencies that require interop
      dependencies: [
        "styled-components",
        "lodash",
        "inversify-inject-decorators",
      ],
    }),
  ],
  resolve: {
    alias: {
      "@api": path.resolve(projectRootDir, "src/api"),
      "@common": path.resolve(projectRootDir, "src/common"),
      "@components": path.resolve(projectRootDir, "src/components"),
      "@models": path.resolve(projectRootDir, "src/models"),
      "@service": path.resolve(projectRootDir, "src/service"),
      "@store": path.resolve(projectRootDir, "src/store"),
      "@theme": path.resolve(projectRootDir, "src/theme"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: base_url,
        // rewrite: path => path.replace("/api", ""),
        changeOrigin: true,
      },
    },
  },
};

export default config;
