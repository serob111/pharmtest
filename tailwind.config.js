/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        "white-transparent": 'rgba(255,255,255,0.06)',
        primary: "#1A3A85",
        darkblue: "#0D1D41",
        primeblue:"#305997",
        lightblue:'#E1F0FB',
        strongblue:'#112552',
        'background-light-gray': '#F5F7FA'
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        disabled:'#E7EBF1',
        primary: {
          DEFAULT:"#1A3A85",
          light:'#414E6D',
          dark:"#0D1D41"
        },
        primeblue:"#305997",
        secondary: {
          DEFAULT: '#6B7280',
          light: '#D1D5DB',
          dark: '#374151',
          extralight:"#596585"
        },
      },
    },
  },
  plugins: [],
};
