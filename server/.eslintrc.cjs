const path = require("path")

/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
    extends: [
        "../.eslintrc.cjs",
        "plugin:@next/next/recommended",
    ],
    settings: {
        tailwindcss: {
            config: path.join(__dirname, "./tailwind.config.ts"),
        },
    },
}