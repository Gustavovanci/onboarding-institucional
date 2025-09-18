// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Garante que todos os arquivos da pasta src sejam lidos
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#3487C3',
        'brand-secondary': '#448A65',
        'brand-accent': '#D94D3D',
        'brand-light': '#F0F4F8',
        'brand-dark': '#0D1B2A',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // O plugin que adicionamos
  ],
}