/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ejs}", "./public/**/*.{html,js,ejs}"],
  theme: {
    extend: {
      colors: {
        colorPrimary: "#6139ff",
        colorPrimaryDark: "#5130d9",
        colorAccent: "#8f7cf5",
        colorBackground: "#ffffff",
        colorSurface: "#ffffff", // Card, Modals background
        colorSurfaceSecondary: "#f9fafb", // Textbox background
        textPrimary: "#2f2e41",
        textSecondary: "rgba(46,45,64,0.7)",
      },
      boxShadow: {
        card: "rgba(149, 157, 165, 0.07) 0px 8px 24px;",
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
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out forwards",
        "fade-out": "fadeOut 0.2s ease-in forwards",
        "slide-in-up": "slideInUp 0.2s ease-out forwards",
        "slide-out-down": "slideOutDown 0.2s ease-in forwards",
      },
    },
  },
  plugins: [],
}

