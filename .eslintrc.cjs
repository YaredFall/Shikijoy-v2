
/**
 * @type {import("eslint").Linter.Config}
 * @type {import("@typescript-eslint/eslint-plugin").Linter.Config}
 */
const config = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    ignorePatterns: [
        "dist/*",
        "next-env.d.ts",
    ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:@stylistic/recommended-extends",
        "plugin:tailwindcss/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: [
        "@typescript-eslint",
        "@stylistic",
        "react",
    ],
    rules: {
        "@stylistic/indent": ["error", 4],
        "@stylistic/jsx-indent": ["error", 4],
        "@stylistic/jsx-indent-props": ["error", 4],
        "@stylistic/quotes": [
            "warn",
            "double",
            {
                avoidEscape: true,
                allowTemplateLiterals: true,
            },
        ],
        "@stylistic/semi": [
            "error",
            "always",
        ],
        "@stylistic/multiline-ternary": ["error", "always-multiline"],
        "@stylistic/object-curly-spacing": ["error", "always"],
        "@stylistic/jsx-curly-brace-presence": ["error", { props: "always", children: "ignore" }],
        "@stylistic/jsx-curly-newline": ["error", {
            multiline: "consistent",
            singleline: "consistent",
        }],
        "@stylistic/jsx-one-expression-per-line": ["error", { allow: "single-line" }],
        "@stylistic/padded-blocks": "off",
        "@stylistic/eol-last": ["error", "never"],
        "@stylistic/brace-style": ["error", "1tbs"],
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "warn",
        "prefer-const": "warn",
        "@typescript-eslint/ban-types": [
            "error",
            {
                types: {
                    "{}": {
                        message: [
                            '`{}` actually means "any non-nullish value".',
                            '- If you want a type meaning "any object", you probably want `object` instead.',
                            '- If you want a type meaning "any value", you probably want `unknown` instead.',
                            '- If you want a type meaning "empty object", you probably want `Record<never, never>` instead.',
                            '- If you really want a type meaning "any non-nullish value", you probably want `NonNullable<unknown>` instead.',
                        ].join("\n"),
                        suggest: [
                            "object",
                            "unknown",
                            "Record<never, never>",
                            "NonNullable<unknown>",
                        ],
                    },
                },
                extendDefaults: true,
            },
        ],
        "no-empty-pattern": ["warn", { allowObjectPatternsAsParameters: true }],
        "@typescript-eslint/no-explicit-any": "warn",
        "@stylistic/member-delimiter-style": ["error", {
            multiline: {
                delimiter: "semi",
                requireLast: true,
            },
            singleline: {
                delimiter: "semi",
                requireLast: true,
            },
            multilineDetection: "brackets",
        }],
        "@stylistic/no-multiple-empty-lines": ["error", {
            max: 2,
        }],
        "@stylistic/no-trailing-spaces": ["warn", {
            skipBlankLines: true,
        }],
    },
    overrides: [
        {
            env: {
                node: true,
            },
            files: [
                ".eslintrc.{js,cjs}",
            ],
            parserOptions: {
                sourceType: "script",
            },
        },
        {
            files: [
                "*.config.*",
                "*.cjs",
            ],
            rules: {
                "@stylistic/semi": [
                    "error",
                    "never",
                ],
                "@typescript-eslint/no-var-requires": "off",
            },
        },
    ],
}

module.exports = config