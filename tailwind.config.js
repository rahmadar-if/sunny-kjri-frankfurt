/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        sunny: {
          gold: '#F59E0B',
          goldHover: '#D97706',
          goldLight: '#FEF3C7',
          goldDark: '#B45309',
          navy: '#0B2545',
          navyDark: '#07182C',
          navyLight: '#133B6B',
          slate: '#475569',
          lightBg: '#F8FAFC',
          cardBorder: '#E2E8F0',
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(11, 37, 69, 0.05), 0 4px 6px -2px rgba(11, 37, 69, 0.025)',
        'card-hover': '0 10px 25px -5px rgba(11, 37, 69, 0.1), 0 8px 10px -6px rgba(11, 37, 69, 0.05)',
      }
    },
  },
  plugins: [],
}
