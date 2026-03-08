/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      colors: {
        cream: '#FCEFCB',
        'brown-dark': '#653D15',
        amber: '#E9A319',
        'off-white': '#FFF5EC',
      },
    },
  },
  plugins: [],
};

