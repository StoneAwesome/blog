/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        _bsPrimary: "#0C3759",
        _bsSecondary: "#D0D0D0",
        _bsSuccess: "#758e4f",
        _bsInfo: "#75A0D5",
        _bsWarning: "#fbb13c",
        _bsDanger: "#ce4141",
        _bsLight: "#f4f4f4",
        _bsDark: "#1d1e1c",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
