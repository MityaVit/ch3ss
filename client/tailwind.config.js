/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        actor: ['Actor', 'serif'],
        aldrich: ['Aldrich', 'sans-serif']
      }
    },
  },
  plugins: [],
}