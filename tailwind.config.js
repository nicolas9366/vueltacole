/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
      },
      colors: {
        'mario-red': '#e52521',
        'mario-blue': '#5c94fc',
        'mario-yellow': '#f8d878',
        'mario-border': '#222',
      },
      boxShadow: {
        'mario': '4px 4px 0px #222',
        'mario-sm': '2px 2px 0px #222',
        'mario-lg': '6px 6px 0px #222',
      },
    },
  },
  plugins: [],
};
