/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#18B4B7",
        secondary: "#232639",
      },
    },
    plugins: [
      require("@tailwindcss/forms"),
    ],
  },
};
