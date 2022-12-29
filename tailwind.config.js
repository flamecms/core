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
            "flame-bg": "",
            "nav-bg": "#1a1a1a" 
        }
      },
    },
    plugins: []
}