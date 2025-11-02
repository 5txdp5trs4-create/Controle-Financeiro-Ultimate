import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Plugins específicos do Replit (runtimeErrorOverlay, cartographer, devBanner) foram removidos,
// pois eles causam a falha no build de produção do Netlify.

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      // Substituído 'import.meta.dirname' por '__dirname' para compatibilidade com CJS
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  // Definindo 'root' e 'build.outDir' com '__dirname'
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
