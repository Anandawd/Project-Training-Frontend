// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { fileURLToPath } from "url";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  plugins: [vue(), mkcert()],
  server: {
    https: true,
  },
  build: {
    sourcemap: false,
    outDir: "./build/",
    rollupOptions: {
      output: {
        cache: false,
        entryFileNames: `[name].[hash].js`,
        chunkFileNames: `[name].[hash].js`,
        //   (chunkInfo) => {
        //   if (chunkInfo.name.includes("stimulsoft.viewer")) {
        //     return `[name].js`; // Tanpa hash
        //   }
        //   return `[name].[hash].js`; // Tambahkan hash untuk file lain
        // },
        assetFileNames: `[name].[ext]`,
      },
      // manualChunks(id) {
      //   if (id.includes("stimulsoft.viewer")) {
      //     return "stimulsoft.viewer"; // Buat chunk tanpa hash
      //   }
      // },
    },
  },
  resolve: {
    alias: {
      // '@/': `${path.resolve(__dirname, 'src')}/`
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    // new additional from proposal and task calendar
    dedupe: ["vue"],
  },
});
