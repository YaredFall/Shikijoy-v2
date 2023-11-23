/**
 * @type {import("eslint").Linter.Config}
 * @type {import("@typescript-eslint/eslint-plugin").Linter.Config}
 */
const config = {
  "root": true,
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended"
  ],
  "overrides": [
    {
      "env": {
        "node": true
      },
      "files": [
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
        "sourceType": "script"
      }
    },
    {
      "files": [
        "*.config.*"
      ],
      "rules": {
        "@stylistic/indent": [
          "error",
          2
        ],
        "@stylistic/semi": [
          "error",
          "never"
        ]
      }
    }
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint",
    "@stylistic",
    "react"
  ],
  "rules": {
    "@stylistic/indent": [
      "error",
      2
    ],
    "@stylistic/quotes": [
      "warn",
      "double"
    ],
    "@stylistic/semi": [
      "error",
      "always"
    ],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "prefer-const": "warn",
    "@typescript-eslint/ban-types": "warn",
    "no-empty-pattern": "warn"
  },
  "ignorePatterns": [
    "pupflare/*"
  ]
};

module.exports = config;
