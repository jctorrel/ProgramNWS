/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette NWS
        nws: {
          yellow: '#ffc72c',
          teal: '#00c7b1',
          purple: '#6c3df4',
          red: '#ff4b4b',
        },
      },
      borderRadius: {
        'xl': '18px',
        'xxl': '22px',
        '3xl': '28px',
      },
      boxShadow: {
        'soft': '0 16px 40px rgba(15, 23, 42, 0.12)',
        'button': '0 8px 22px rgba(76, 81, 191, 0.35)',
        'button-hover': '0 11px 30px rgba(76, 81, 191, 0.5)',
      },
      animation: {
        'blink': 'blink 1s infinite alternate',
      },
      keyframes: {
        blink: {
          'from': {
            opacity: '0.2',
            transform: 'translateY(0)',
          },
          'to': {
            opacity: '0.9',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
  },
  plugins: [],
}
