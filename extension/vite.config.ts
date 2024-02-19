import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { ManifestV3Export, crx } from "@crxjs/vite-plugin"
import manifest from "./manifest.json"

export default defineConfig({
    plugins: [
        react(),
        crx({ manifest: manifest as ManifestV3Export }),
    ],
    build: {
        rollupOptions: {
            input: {
                main: "src/popup/index.html",
            },
        },
        outDir: "../dist",
    },
})