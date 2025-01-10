/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#334155',
            p: {
              marginBottom: '1.5em',
            },
            'h1, h2, h3, h4': {
              fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
              fontWeight: '600',
              color: '#1e293b',
            },
          },
        },
      },
    },
  },
  plugins: [],
};