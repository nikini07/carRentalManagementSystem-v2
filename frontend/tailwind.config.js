module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1F2937', // Dark gray for nav
        secondary: '#F0F4F8', // Light gray bg
        accent: '#3B82F6', // Blue buttons
        success: '#10B981', // Green paid
        error: '#EF4444', // Red unpaid
        text: '#111827', // Dark text
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
};