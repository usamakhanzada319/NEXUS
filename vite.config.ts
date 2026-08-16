import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    open: true,
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router-dom/")
          ) {
            return "vendor";
          }

          if (id.includes("node_modules/recharts/")) {
            return "charts";
          }

          if (id.includes("node_modules/lucide-react/")) {
            return "icons";
          }

          return null;
        },
      },
    },

    minify: "terser",
    sourcemap: false,
  },
});
