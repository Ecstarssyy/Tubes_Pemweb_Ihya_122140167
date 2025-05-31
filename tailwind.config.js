// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#333446',    // Warna gelap utama Anda
        'brand-medium': '#7F8CAA', // Warna medium
        'brand-light': '#B8CFCE',  // Warna cerah
        'brand-bg': '#EAEFEF',     // Warna untuk background utama halaman

       
        'brand-action': '#7F8CAA', // Atau bisa juga #333446 jika ingin tombol gelap
        'brand-action-hover': '#5E6B8A', // Variasi lebih gelap dari brand-medium untuk hover
        
        // Warna netral standar tetap berguna
        'white': '#FFFFFF',
        'black': '#000000',
        'gray-100': '#f7fafc', // abu-abu sangat terang
        'gray-200': '#edf2f7',
        'gray-300': '#e2e8f0',
        'gray-400': '#cbd5e0',
        'gray-500': '#a0aec0', // abu-abu medium
        'gray-600': '#718096',
        'gray-700': '#4a5568', // abu-abu gelap
        'gray-800': '#2d3748',
        'gray-900': '#1a202c',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Lexend', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'custom-light': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
        'custom-strong': '0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -4px rgba(0, 0, 0, 0.07)',
      }
    },
  },
  plugins: [],
}