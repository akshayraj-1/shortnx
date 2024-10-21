/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ejs}"],
  theme: {
    extend: {
      colors: {
        primary: '#6139ff',
        background: '#f8f9fb',
        surface: '#ffffff',
        surfaceVariant: '#f7f9fc',
        textPrimary: '#2f2e41',
        textSecondary: '#878899',
        textTertiary: '#d8dde6',
      },
      backgroundImage: {
        'emphasis-short': 'url("/images/emphasizing-short.svg")',
        'emphasis-wide': 'url("/images/emphasizing-wide-.svg")',
        noise: 'url("/images/noise.jpg")',
        star: 'url("/images/star.svg")',
      },
      fontFamily: {
        poppins: `Poppins, sans-serif`,
        'gelica-black': `Gelica Black, sans-serif`,
      }
    },
  },
  plugins: [],
}

