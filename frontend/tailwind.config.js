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
        cardBorder: '#DDD6FE',
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
        success: '#16A34A',
        warning: '#D97706',
        error: '#DC2626',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(124, 58, 237, 0.06), 0 1px 3px -1px rgba(0, 0, 0, 0.05)',
        card: '0 4px 20px -2px rgba(91, 33, 182, 0.06), 0 2px 6px -1px rgba(91, 33, 182, 0.04)',
        hover: '0 10px 25px -4px rgba(124, 58, 237, 0.12), 0 4px 8px -2px rgba(124, 58, 237, 0.06)',
      },
      borderRadius: {
        card: '1rem',
        control: '0.625rem',
      },
    },
  },
  plugins: [],
}
