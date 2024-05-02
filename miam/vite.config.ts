import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

const nodeEnv = process.env.NODE_ENV || "development";
export default defineConfig({
  base: nodeEnv === "production" ? "/miam" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
      "@common": path.resolve(__dirname, "../common"),
    },
  }
});
