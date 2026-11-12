/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        magaiver: {
          bg: '#F5EBD7',        // Fundo bege retrô
          card: '#FCF8F2',      // Fundo dos cartões
          brown: '#2E1A0F',     // Marrom profundo (header e footer)
          terracotta: '#C85327',// Terracota / laranja queimado
          olive: '#8AA639',     // Verde-oliva (Adicionar Cliente)
          border: '#D8C7B0',    // Borda dos cards e inputs
          redStatus: '#EA3838', // Status Atrasado
          orangeStatus: '#E58E00', // Status Pendente
          greenStatus: '#1CB55C',  // Status Pago
        }
      },
    },
  },
  plugins: [],
}