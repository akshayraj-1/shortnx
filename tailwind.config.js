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
        'noise-2': 'url("/images/noise2.jpg")',
        star: 'url("/images/star.svg")',
      },
      fontFamily: {
        'space-grotesk': `Space Grotesk, sans-serif`,
        'gelica-black': `Gelica Black, sans-serif`,
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideOutDown: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'fade-out': 'fadeOut 0.2s ease-in forwards',
        'slide-in-up': 'slideInUp 0.2s ease-out forwards',
        'slide-out-down': 'slideOutDown 0.2s ease-in forwards',
      },
    },
  },
  plugins: [],
}

