/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  corePlugins: {
    preflight: true,
  },
  plugins: [require('@tailwindcss/typography')],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: 'var(--border-color, rgb(229, 231, 235))',
      },
      colors: {
        primary: {
          50: '#fff9e6',
          100: '#ffedb3',
          200: '#ffe180',
          300: '#ffd54d',
          400: '#ffc926',
          500: '#ffc107', // Main gold color
          600: '#ffb300',
          700: '#ffa000',
          800: '#ff8f00',
          900: '#ff6f00',
        },
        kintsugi: {
          gold: {
            50: '#fff9e6',
            100: '#ffedb3',
            200: '#ffe180',
            300: '#ffd54d',
            400: '#ffc926',
            500: '#ffc107', // Main gold color
            600: '#ffb300',
            700: '#ffa000',
            800: '#ff8f00',
            900: '#ff6f00',
          },
          dark: {
            50: '#f5f5f5',
            100: '#e0e0e0',
            200: '#bdbdbd',
            300: '#9e9e9e',
            400: '#757575',
            500: '#424242', // Main dark color
            600: '#303030',
            700: '#212121',
            800: '#1a1a1a',
            900: '#121212',
          },
          accent: {
            red: '#b71c1c',
            blue: '#0d47a1',
            green: '#1b5e20',
            purple: '#4a148c',
          },
          background: '#f5f5f5',
          surface: '#ffffff',
          error: '#b00020',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
