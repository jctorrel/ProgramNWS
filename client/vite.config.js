import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  server: {
    https: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000", // 👈 IMPORTANT : HTTP, pas HTTPS
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mkcert()],
});
