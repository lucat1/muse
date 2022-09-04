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
      gridTemplateColumns: {
        layout: "minmax(12rem, 16rem) auto",
        smlayout: "auto",
      },
      gridTemplateRows: {
        layout: "4rem minmax(0, auto) 6rem",
      },
    },
  },
  // specify other options here
};
