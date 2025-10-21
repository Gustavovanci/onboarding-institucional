/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ✅ Cores principais da identidade visual do HC
        brand: {
          red: "#E74121",      // Vermelho institucional
          azure: "#2B97D4",    // Azul principal
          green1: "#20856B",   // Verde principal
          green2: "#136D5E",   // Verde escuro
          green3: "#0D4E48",   // Verde mais escuro
          green4: "#237450",   // Verde médio
          green5: "#1E5A3E",   // Verde escuro alternativo
          light: "#F0F4F8",    // Fundo claro
          dark: "#0D1B2A",     // Texto escuro
        },
        
        // ✅ Cores da Landing Page (vibrantes)
        landing: {
          red: '#FF4D3D',      // Vermelho vibrante da landing
          'red-dark': '#FF3D2D', // Vermelho hover
          blue: '#4CA8E8',     // Azul claro da landing
          'blue-dark': '#3B8FD1', // Azul hover
          green: '#2D9B6C',    // Verde da landing
          'green-dark': '#1F7A52', // Verde hover
        },
        
        // ✅ Cores do Admin Dashboard
        admin: {
          bg: '#0f172a',       // slate-900
          card: '#1e293b',     // slate-800
          text: '#cbd5e1',     // slate-300
          border: 'rgba(255, 255, 255, 0.1)',
        }
      },
      
      fontFamily: { 
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      
      boxShadow: { 
        card: "0 10px 30px rgba(15, 23, 42, .06)",
        'card-hover': "0 20px 40px rgba(15, 23, 42, .12)",
        'admin': "0 8px 32px rgba(0, 0, 0, 0.3)",
      },
      
      borderRadius: { 
        xxl: "1.25rem",
        '3xl': '1.5rem',
      },
      
      backdropBlur: {
        xs: '2px',
      },
      
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
  
  // ✅ Adiciona suporte para classes arbitrárias de forma segura
  safelist: [
    'bg-landing-red',
    'bg-landing-blue', 
    'bg-landing-green',
    'from-landing-red',
    'to-landing-blue',
    'from-landing-blue',
    'to-landing-green',
    'from-brand-azure',
    'to-brand-green1',
    'from-brand-red',
    'to-brand-green3',
  ]
};