/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0f0ff',
          200: '#b9e0ff',
          300: '#7cc5ff',
          400: '#36a7ff',
          500: '#0088ff',
          600: '#006fd4',
          700: '#0058ab',
          800: '#004c8c',
          900: '#003968',
        },
        surface: {
          DEFAULT: 'var(--surface-bg)',
          light: 'var(--surface-light)',
          hover: 'var(--surface-hover)',
          border: 'var(--surface-border)'
        },
        content: {
          DEFAULT: 'var(--content)',
          muted: 'var(--content-muted)',
          inverse: 'var(--content-inverse)'
        }
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
};