import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  base: "/Programs/",
  server: {
    https: true,
    port: 5173,
    proxy: {
      "/Programs/api": {
        target: "http://localhost:3002", // 👈 IMPORTANT : HTTP, pas HTTPS
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mkcert()],
});
