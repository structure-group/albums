module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    extend: {
      colors: {
        "indigo-gray": "#dfe1e9",
        "indigo-white": "#f5f5f5",
      },
    },
  },
  screens: {},
  variants: {
    extend: {},
  },
  plugins: [],
};
