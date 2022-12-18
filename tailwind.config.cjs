/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-inter)'],
        sans: ['var(--font-source-sans-pro)']
      },
    },
  },
  plugins: [],
};
