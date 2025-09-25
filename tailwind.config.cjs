/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          azure: "#2b97d4",      // azul
          red: "#e74121",        // vermelho vívido
          teal: "#238264",       // turquesa
          tealDark: "#196653",   // turquesa escuro
          tealDarker: "#124e48", // turquesa mais escuro
          light: "#F0F4F8",
          dark: "#0D1B2A",
        },
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      boxShadow: { card: "0 10px 30px rgba(15, 23, 42, .06)" },
      borderRadius: { xxl: "1.25rem" },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
