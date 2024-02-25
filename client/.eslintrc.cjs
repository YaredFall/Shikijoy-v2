const path = require("path")

module.exports = {
    env: { browser: true, es2020: true },
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh'],

    rules: {
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
    },
    settings: {
        tailwindcss: {
            config: path.join(__dirname, "./tailwind.config.js"),
        },
    },
    extends: [
        '../.eslintrc.cjs',
        'plugin:storybook/recommended',
    ]
};
