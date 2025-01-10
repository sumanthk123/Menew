/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lavender: '#DADFF7',
        gunmetal: '#232C33',
        'french-grey': '#B5B2C2',
      },
    },
  },
  plugins: [],
};