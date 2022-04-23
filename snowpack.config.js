/** @type {import("snowpack").SnowpackUserConfig } */
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
  packageOptions: {
    /* ... */
  },
  devOptions: {
    port: 3000,
    tailwindConfig: "./tailwind.config.js",
  },
  buildOptions: {
    sourcemap: true,
  },
};
