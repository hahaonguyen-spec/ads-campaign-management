/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fbf8ef',
          100: '#f4ebd3',
          200: '#e7d4a4',
          300: '#d7b76d',
          400: '#c89e3f',
          500: '#b68729',
          600: '#9b6c1f',
          700: '#7c511c',
          800: '#68421e',
          900: '#58381e',
          950: '#331e0e',
        },
        dark: {
          900: '#0B0F17',
          800: '#111827',
          700: '#1F2937',
          600: '#374151',
          500: '#4B5563',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
