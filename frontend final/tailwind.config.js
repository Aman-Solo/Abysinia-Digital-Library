/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        heritage: {
          beige: '#f5f1e6',
          'primary-brown': '#9c4f2e',
          'dark-brown': '#6b2f1a',
          text: '#4a2a1a',
          border: '#d9c6b5',
          button: '#a85a3a',
          'button-hover': '#8f4630',
          'light-beige': '#fffbf5',
        }
      },
      fontFamily: {
        'sans': ['Poppins', 'system-ui', 'sans-serif'],
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'heritage': ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'heritage': '0 10px 30px rgba(106, 47, 26, 0.1)',
        'heritage-lg': '0 15px 40px rgba(106, 47, 26, 0.15)',
        'heritage-md': '0 4px 12px rgba(106, 47, 26, 0.08)',
      }
    },
  },
  plugins: [],
}
