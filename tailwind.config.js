/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans: ['Noto Sans SC', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#FF6B35',
          dark: '#e85a25',
        },
      },
    },
  },
  plugins: [],
};
