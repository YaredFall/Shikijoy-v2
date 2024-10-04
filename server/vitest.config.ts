/// <reference types="vitest" />
import { resolve } from "path"
import { defineConfig } from "vite"

export default defineConfig({
    test: {
        alias: [{
            find: "@server",
            replacement: resolve(__dirname, "./src"),
        }],
    },
})