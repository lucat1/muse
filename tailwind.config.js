// tailwind.config.js
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./public/**/*.html", "./src/**/*.{ts,tsx,css}"],
  plugins: [require("@tailwindcss/typography")],
  theme: {
    fontFamily: {
      logo: ["'Cooper Black'", "serif"],
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1792px",
      "4xl": "2048px",
    },
    extend: {
      animation: {
        scale: "scale-in 250ms ease-out",
      },
      keyframes: {
        "scale-in": {
          "0%": { opacity: 0, transform: "scale(0)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
    },
  },
  // specify other options here
};
