/// <reference types="vitest" />
import { resolve } from "path"
import { defineConfig } from "vite"

export default defineConfig({
    test: {
        alias: [{
            find: "@client",
            replacement: resolve(__dirname, "./src"),
        }],
    },
})