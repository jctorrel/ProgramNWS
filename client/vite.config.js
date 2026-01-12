import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  base: "/",
  server: {
    https: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3002", // 👈 IMPORTANT : HTTP, pas HTTPS
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("PROXY:", req.method, req.url);
          });
        },
      },
    },
  },
  plugins: [react(), mkcert()],
});
