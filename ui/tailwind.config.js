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
        "indigo-black": "#333333",
        "indigo-red": "#CD1823",
      },
    },
  },
  screens: {},
  variants: {
    extend: {},
  },
  plugins: [],
};
