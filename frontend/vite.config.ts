import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // API Laravel
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },

      // Proteção CSRF
      "/sanctum": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },

      // Login
      "^/login$": {
        target: "http://localhost:8000",
        changeOrigin: true,

        bypass(req) {
          if (req.method === "GET") {
            return "/index.html";
          }
        },
      },

      // Registo
      "^/register$": {
        target: "http://localhost:8000",
        changeOrigin: true,

        bypass(req) {
          if (req.method === "GET") {
            return "/index.html";
          }
        },
      },

      // Logout
      "^/logout$": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
