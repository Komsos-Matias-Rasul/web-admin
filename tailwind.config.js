const {heroui} = require("@heroui/theme");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(button|dropdown|input|modal|select|spinner|table|ripple|menu|divider|popover|form|listbox|scroll-shadow|checkbox|spacer).js"
  ],
  theme: {
    extend: {
      colors: {
      },
    },
  },
  plugins: [require('@tailwindcss/typography')({
      className: 'editor-typo'
    }),heroui()],
};
