/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Habilita el modo oscuro basado en una clase
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        iosGray: '#F2F2F7',
        iosBlue: '#007AFF',
        iosText: '#1C1C1E',
        iosBackground: '#FFFFFF',
        iosDarkBackground: '#1C1C1E',
        iosLightGray: '#EFEFF4',
      },
      fontFamily: {
        ios: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
      },
      borderRadius: {
        'ios': '20px',
      },
    },
  },
  plugins: [],
}


