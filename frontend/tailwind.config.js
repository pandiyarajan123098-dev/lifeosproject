/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: '#F8F7FF',
        card: '#FFFFFF',
        primary: {
          DEFAULT: '#7C3AED',
          dark: '#5B21B6',
          light: '#EDE9FE',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        mainText: '#1F2937',
        secondaryText: '#6B7280',
        cardBorder: '#DDD6FE',
        success: '#16A34A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(124, 58, 237, 0.07), 0 4px 6px -2px rgba(124, 58, 237, 0.05)',
        card: '0 4px 20px -2px rgba(91, 33, 182, 0.06), 0 2px 4px -1px rgba(91, 33, 182, 0.04)',
        hover: '0 10px 25px -5px rgba(124, 58, 237, 0.12), 0 8px 10px -6px rgba(124, 58, 237, 0.08)',
      },
    },
  },
  plugins: [],
}
