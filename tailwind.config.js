/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        shoreline: "#79ABB7",
        open: "#21233A",
        trench: {
          light: '#47485C"',
          DEFAULT: "#323340"
        }
      }
    },
  },
  plugins: []
}