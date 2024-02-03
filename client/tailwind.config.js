const plugin = require("tailwindcss/plugin")
const colors = require("tailwindcss/colors")

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./tailwind.config.js",
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    primary: "rgb(31, 31, 31)",
                    // secondary: colors.neutral[900],
                    // tertiary: colors.neutral[700],
                },
                foreground: {
                    primary: "rgb(247, 247, 247)",
                },
                accent: {
                    primary: "rgb(255, 123, 121)",
                    secondary: "rgb(116, 200, 200)",
                },
                danger: "rgb(248 60 60)",
            },
            opacity: {
                ".75": ".75",
                ".5": ".50",
                ".25": ".25",
                ".125": ".125",
                ".0625": ".0625",
            },
            animation: {
                "pulse-slow": "pulse-slow 3s ease-in-out infinite",
            },
            keyframes: {
                "pulse-slow": {
                    "0%,67%": { opacity: 1 },
                    "33%": { opacity: 0.5 },
                },
            },
            spacing: {
                "header-width": "5rem",
                "breadcrumbs-height": "3rem",
                "aside-width": "27rem",
            },
            aspectRatio: {
                poster: "250 / 354",
            },
        },
    },
    plugins: [
        require("tailwindcss-animated"),
        plugin(function ({ addBase, addComponents }) {
            addBase({
                "*": {
                    "scroll-margin": "1rem",
                },
                "html": {
                    "@apply bg-neutral-950 text-foreground-primary": "",
                    "color-scheme": "dark",
                    "font-family": "'Rubik', sans-serif",
                },
                "html, body": {
                    "@apply h-full": "",
                },
                "#app": {
                    "@apply min-h-full pl-header-width flex relative": "",
                },
                "main": {
                    "@apply w-full": "",
                },
                "iframe": {
                    "color-scheme": "normal",
                },
            }),
            addComponents({
                ".animejoy-poster": {
                    "@apply w-[250px] h-[354px]": "",
                },
                ".link": {
                    "@apply highlight:brightness-90": "",
                },
                ".link-text": {
                    "@apply text-foreground-primary/.75 highlight:text-foreground-primary highlight:underline": "",
                },
            })
        }),
        plugin(function ({ addVariant }) {
            addVariant("highlight", "&:is(:focus-visible,:hover)"),
            addVariant("group-highlight", ":merge(.group):is(:focus-visible,:hover) &"),
            addVariant("direct-children", "&>*")
        }),
    ],
}