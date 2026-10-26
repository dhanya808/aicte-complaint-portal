/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aicte: {
          blue: '#0B3C5D',
          navy: '#1D2731',
          gold: '#D9B310',
          sky: '#328CC1',
          orange: '#F26419',
          crimson: '#9E2A2B',
          saffron: '#FF9933',
          green: '#138808'
        }
      }
    },
  },
  plugins: [],
}