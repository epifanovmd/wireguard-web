import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import path from "path";
import { defineConfig } from "vite";
import { cjsInterop } from "vite-plugin-cjs-interop";

const projectRootDir = path.resolve(__dirname);

dotenv.config({ path: [`.env.${process.env.NODE_ENV}`, ".env"] });

const { VITE_HOST, VITE_PORT, VITE_BASE_URL } = process.env;

const HOST = VITE_HOST;
const PORT = VITE_PORT ? Number(VITE_PORT) : 3000;

export default defineConfig({
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
      dependencies: ["lodash", "inversify-inject-decorators"],
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "~@api": path.resolve(projectRootDir, "src/api"),
      "~@common": path.resolve(projectRootDir, "src/common"),
      "~@components": path.resolve(projectRootDir, "src/components"),
      "~@models": path.resolve(projectRootDir, "src/models"),
      "~@service": path.resolve(projectRootDir, "src/service"),
      "~@store": path.resolve(projectRootDir, "src/store"),
      "~@theme": path.resolve(projectRootDir, "src/theme"),
    },
  },
  server: {
    host: HOST,
    port: PORT,
    proxy: {
      "/api": {
        target: VITE_BASE_URL,
        changeOrigin: true,
      },
    },
  },
  preview: {
    allowedHosts: ["wireguard.force-dev.ru"],
    host: HOST,
    port: PORT,
  },
});
