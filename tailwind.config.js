// tailwind.config.js
module.exports = {
  mode: "jit",
  darkMode: "class",
  purge: ["./public/**/*.html", "./src/**/*.{ts,tsx,css}"],
  plugins: [require("@tailwindcss/typography")],
  theme: {
    fontFamily: {
      logo: ["'Cooper Black'", "serif"],
    },
  },
  // specify other options here
};
