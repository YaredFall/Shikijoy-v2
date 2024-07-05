const path = require("path");

module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        "../.eslintrc.cjs",
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
    ],
    settings: {
        tailwindcss: {
            config: path.join(__dirname, "./tailwind.config.ts"),
        },
    },
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh'],
    rules: {
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
    },
};
