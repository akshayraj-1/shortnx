/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,js,ejs}", "./public/**/*.{html,js,ejs}"],
  theme: {
    extend: {
      colors: {
        colorPrimary: "#6139ff",
        colorBackground: "#f8f9fb",
        colorSurface: "#ffffff", // Card, Modals background
        colorSurfaceSecondary: "#fafbfc", // Textbox background
        colorBorder: "#dbdbde",
        colorBorderHover: "#d7d7d9",
        textPrimary: "#2f2e41",
        textSecondary: "#878899"
      },
      boxShadow: {
        toastShadow: "0 4px 6px -4px rgba(218,218,218,0.1);",
      },
      backgroundImage: {
        gradientBlur: "url('/images/blur.jpg')",
      },
      fontFamily: {
        "space-grotesk": "Space Grotesk, sans-serif",
        "gelica-black": "Gelica Black, sans-serif",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
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

