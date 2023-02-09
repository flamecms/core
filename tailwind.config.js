const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
            sans: ['var(--font-quicksand)', ...fontFamily.sans],
            "Poppins": ['var(--font-poppins)'],
            "Quicksand": ['var(--font-quicksand)'],
            "Roboto": ['var(--font-roboto)'],
        },
        colors: {
            "accent": "#13121C",
            "primary": "#1A1927",
            "secondary": "#1F1E2F",
            "link": "#4085d2",
            "legacy-accent": "#262626",
            "legacy-primary": "#1a1a1a",
            "mui-primary": "#2267b5"
        }
      },
    },
    plugins: []
}