/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html', "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'bg-red-800', // If you're using dynamic classes, ensure they are safelisted
  ],
  theme: {
    extend: {
      colors: {
        customGray: '#b0b0b0', // Define your custom gray color
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.5)' },
          '100%': { transform: 'scale(1.5)' }, // Keep it scaled up at the end
        },
      },
      animation: {
        pop: 'pop 0.4s ease-in-out',
      },
    },
  },
  plugins: [],
}
