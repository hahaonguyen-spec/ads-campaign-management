/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cpt: {
          cyan: '#33CCFF',
          turquoise: '#0AE5D5',
          navy: '#0C2038',
          card: '#112037',
          darkBg: '#071322'
        }
      }
    },
  },
  plugins: [],
}
