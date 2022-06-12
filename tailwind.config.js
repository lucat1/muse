// tailwind.config.js
module.exports = {
  mode: "jit",
  purge: ["./public/**/*.html", "./src/**/*.{ts,tsx,css}"],
  plugins: [require("@tailwindcss/typography")],
  // specify other options here
};
