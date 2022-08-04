/** @type {import("snowpack").SnowpackUserConfig } */
const dev = process.env.NODE_ENV == 'development'
module.exports = {
  routes: [
    {
      match: "routes",
      src: ".*",
      dest: "/index.html",
    },
  ],
  mount: {
    public: { url: "/" },
    src: { url: "/dist" },
  },
  plugins: [
    "@snowpack/plugin-react-refresh",
    "@snowpack/plugin-typescript",
    "@snowpack/plugin-postcss",
  ],
  devOptions: {
    port: 3000,
    tailwindConfig: "./tailwind.config.js",
  },
  buildOptions: {
    sourcemap: dev,
    baseUrl: dev ? '/' : 'https://lucat1.github.io/muse/',
  },
    optimize: {
    minify: true,
    target: 'es2018',
  },
};
