const plugin = require("tailwindcss/plugin")

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./tailwind.config.js"
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
        danger: "rgb(248 60 60)"
      },
      opacity: {
        ".75": ".75",
        ".5": ".50",
        ".25": ".25",
        ".125": ".125",
        ".0625": ".0625"
      },
      animation: {
        "pulse-slow": "pulse-slow 3s ease-in-out infinite"
      },
      keyframes: {
        "pulse-slow": {
          "0%,67%": { opacity: 1 },
          "33%": { opacity: 0.5 }
        }
      },
      spacing: {
        "header": "4rem"
      }
    },
  },
  plugins: [
    require("tailwindcss-animated"),
    plugin(function ({ addBase, addComponents }) {
      addBase({
        "html": {
          "@apply bg-tertiary text-primary": "",
          "color-scheme": "dark",
          "font-family": "'Rubik', sans-serif",
        },
        "html, body, #app": {
          "@apply h-full": ""
        },
        "#app": {
          "@apply pl-header": ""
        },
        "iframe": {
          "color-scheme": "normal"
        },
      }),
      addComponents({
        ".animejoy-poster": {
          "@apply w-[250px] h-[354px]": ""
        },
        ".link": {
          "@apply text-primary/.75 highlight:text-primary highlight:underline": ""
        }
      })
    }),
    plugin(function ({ addVariant }) {
      addVariant("highlight", "&:is(:focus-visible,:hover)")
    }),
  ]
}