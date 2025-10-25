import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuración principal de Vite
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",                // Carpeta de salida
    chunkSizeWarningLimit: 1200,   // Aumenta el límite de tamaño para evitar warnings
  },
});