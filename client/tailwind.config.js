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
                    secondary: "rgb(41, 41, 41)",
                    tertiary: colors.neutral[700],
                    quaternary: "rgb(25, 25, 25)",
                    fill: colors.neutral[950],
                    loading: colors.neutral[500],
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
                "breadcrumbs-height": "3.5rem",
                "aside-width": "27rem",
            },
            aspectRatio: {
                "poster": "250 / 354",
                "shikimori-image": "154 / 240",
            },
            lineHeight: {
                "extra-tight": "1.125rem",
            },
        },
    },
    plugins: [
        require("@yaredfall/tw-grid-auto-fill"),
        require("tailwindcss-animated"),
        plugin(function ({ addBase, addComponents }) {
            addBase({
                "*": {
                    "scroll-margin": "1rem",
                },
                "html": {
                    "@apply bg-background-fill text-foreground-primary": "",
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
                "a[href^=http]": {
                    "@apply cursor-alias": "",
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
            addVariant("highlight", "&:is(:focus-visible,:hover)")
            addVariant("group-highlight", ":merge(.group):is(:focus-visible,:hover) &")
            addVariant("direct-children", "&>*")
            addVariant("not-first", "&:not(&:first-child)")
            addVariant("not-last", "&:not(&:last-child)")
        }),
        plugin(function ({ addUtilities }) {
            addUtilities({
                // https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode
                ".horizontal-writing-tb": { "writing-mode": "horizontal-tb" },
                ".vertical-writing-rl": { "writing-mode": "vertical-rl" },
                ".vertical-writing-lr": { "writing-mode": "vertical-lr" },
                // https://developer.mozilla.org/en-US/docs/Web/CSS/text-orientation
                ".orientation-mixed": { "text-orientation": "mixed" },
                ".orientation-upright": { "text-orientation": "upright" },
                ".orientation-sideways-right": { "text-orientation": "sideways-right" },
                ".orientation-sideways": { "text-orientation": "sideways" },
                ".orientation-glyph": { "text-orientation": "use-glyph-orientation" },
                ".break-words": { "word-break": "break-word" },
                ".outline-ring": { outline: "-webkit-focus-ring-color auto 1px" },
            })
        }),
    ],
}