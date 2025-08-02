import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api/": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/d-solo/": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/public/": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/backend-erp/": {
        target: "http://localhost",
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/backend-erp/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
