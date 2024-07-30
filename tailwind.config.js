/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html', "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        pop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.5)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        pop: 'pop 0.4s ease-in-out',
      },
    },
  },
  plugins: [],
}
