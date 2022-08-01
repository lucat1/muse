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
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1792px',
    }
  },
  // specify other options here
};
