/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{html,js,ejs}", "./public/**/*.{html,js,ejs}"],
  plugins: [
      plugin(function ({ addUtilities }) {
        addUtilities({
          ".no-scrollbar": {
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          },
          ".no-scrollbar::-webkit-scrollbar": {
            display: "none",
          },
          ".rotate-y-180": {
            transform: "rotateY(180deg)",
          },
          ".field-sizing-content": {
            "field-sizing": "content",
          }
        });
      }),
  ],
  theme: {
    container: {
      center: true,
      screens: {
        '2xl': '1536px',
      },
    },
    extend: {
      colors: {
        colorPrimary: "#2563eb",
        colorPrimaryDark: "#2157cc",
        colorAccent: "#306ef2",
        colorBackground: "#ffffff",
        colorBorder: "#e5e5e5",
        colorSurface: "#ffffff", // Card, Modals background
        colorSurfaceSecondary: "#f4f6f7",
        textPrimary: "#2f2e41",
        textSecondary: "rgba(46,45,64,0.7)",
      },
      boxShadow: {
        card: "rgba(149, 157, 165, 0.1) 0px 8px 24px;",
        "card-soft": "rgba(149, 157, 165, 0.03) 0px 5px 25px;",
      },
      fontFamily: {
        "gelica-black": ["Gelica Black, sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideInUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideOutDown: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" },
        },
        popUp: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        popDown: {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.95)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out forwards",
        "fade-out": "fadeOut 0.2s ease-in forwards",
        "pop-up": "popUp 0.2s ease-out forwards",
        "pop-down": "popDown 0.2s ease-in forwards",
        "slide-in-up": "slideInUp 0.2s ease-out forwards",
        "slide-out-down": "slideOutDown 0.2s ease-in forwards",
      },
    },
  }
}

