import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        rollupOptions: {
            output: {
                entryFileNames: "index.js",
                assetFileNames: "index.css",
                chunkFileNames: "chunk.js",
                manualChunks: undefined,
            },
        },
        minify: "terser",
        outDir: "../dist/client",
    },
})