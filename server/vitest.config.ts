/// <reference types="vitest" />
import { resolve } from "path"
import { defineConfig } from "vite"

export default defineConfig({
    test: {
        alias: [{
            find: "@",
            replacement: resolve(__dirname, "./src"),
        }],
    },
})