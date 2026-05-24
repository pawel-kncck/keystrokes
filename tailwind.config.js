/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f5f6f8',
          100: '#e7e9ee',
          300: '#9aa1b1',
          400: '#6b7384',
          500: '#4b5263',
          700: '#252a36',
          800: '#1a1d26',
          900: '#10131a',
          950: '#0a0c12',
        },
        accent: {
          400: '#7dd3fc',
          500: '#38bdf8',
          600: '#0ea5e9',
        },
      },
    },
  },
  plugins: [],
}
