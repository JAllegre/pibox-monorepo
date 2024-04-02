import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

const nodeEnv = process.env.NODE_ENV || "development";
const env = loadEnv(nodeEnv, process.cwd());

export default defineConfig({
  base: nodeEnv === "production" ? "/miam" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
      "@common": path.resolve(__dirname, "../api-server/src/features/miam"),
    },
  },
  server: {
    port: parseInt(env.VITE_PORT),
  },
});
