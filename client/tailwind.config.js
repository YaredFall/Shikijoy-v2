const plugin = require("tailwindcss/plugin")

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(247, 247, 247)"
        },
        secondary: "rgb(48, 48, 48)",
        tertiary: "rgb(36, 36, 36)",
        accent: {
          "primary": "rgb(255, 123, 121)",
          "secondary": "rgb(116, 200, 200)"
        },
        danger: "rgb(255, 123, 121)"
      },
      opacity: {
        ".75": ".75",
        ".5": ".50",
        ".25": ".25",
        ".125": ".125",
        ".0625": ".0625"
      },
    },
  },
  plugins: [
    plugin(function({ addBase, theme }) {
      addBase({
        "html": {
          "@apply bg-tertiary text-primary": "",
          "color-scheme": "dark",
        },
      })
    })
  ]
}