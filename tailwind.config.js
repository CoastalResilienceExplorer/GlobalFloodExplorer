/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        shoreline: {
          dark: "#618993",
          DEFAULT: "#79ABB7",
        },
        open: "#21233A",
        coral: "coral",
        trench: {
          light: '#47485C',
          DEFAULT: "#323340"
        }
      }
    },
    fontFamily: {
      sans: ['"Montserrat"', 'sans-serif'],
      serif: ['"Sorts Mill Goudy"', 'sans-serif'],
    },
  },
  plugins: []
}