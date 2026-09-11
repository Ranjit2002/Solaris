import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  base: "/Solaris/",
  build: {
    chunkSizeWarningLimit: 1000, // Increases the warning limit to 1000 kB
  },
});
