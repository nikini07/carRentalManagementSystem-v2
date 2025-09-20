/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lime': '#A3E635',
        'lime-dark': '#84CC16',
        'neutral-white': '#F5F5F5',
        'neutral-gray-light': '#E5E7EB',
        'neutral-gray-medium': '#6B7280',
        'neutral-gray-600': '#4B5563',
        'neutral-gray-dark': '#374151',
        'red-accent': '#EF4444',
        'red-accent-600': '#DC2626',
      },
    },
  },
  plugins: [],
}