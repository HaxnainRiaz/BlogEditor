/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    "ProseMirror",
    "is-active",
    "is-focused",
    "node-paragraph",
    "node-heading",
  ],
  plugins: [require("@tailwindcss/typography")],
};
