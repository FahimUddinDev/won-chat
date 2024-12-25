/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        secondary: "#100A55",
        primary: "#400B8B",
        "dc-black": "#000929",
        "dc-yellow": "#FCDD08",
        "dc-blue-light": "#071134",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("current", [".active &", "&.active"]);
      addVariant("toggle", [".toggle &", "&.toggle"]);
      addVariant("list-view", [".list &", "&.list"]);
      addVariant("checked", [".checked &", "&.checked"]);
      addVariant("active-dropdown", [
        ".active-dropdown &",
        "&.active-dropdown",
      ]);
      addVariant("filter-active", [".filter-active &", "&.filter-active"]);
      addVariant("aside-active", [".aside-active &", "&.aside-active"]);
    }),
  ],
};
