import { TanStackRouterVite } from "@tanstack/router-vite-plugin"
import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        TanStackRouterVite(),
    ],
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