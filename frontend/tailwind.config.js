/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'slate-850': '#1E293B', // Custom shade for alternating table rows
      },
    },
  },
  plugins: [],
}