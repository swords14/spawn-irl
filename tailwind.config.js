/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0a0a0a',
        neon: {
          green: '#39ff14',
          red: '#ff073a',
          blue: '#0ff',
          purple: '#bc13fe'
        }
      },
      fontFamily: {
        mono: ['"Fira Code"', 'monospace'], 
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}