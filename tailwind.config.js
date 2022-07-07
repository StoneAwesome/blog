/** @type {import('tailwindcss').Config} */

const themeColors = {
  _bsPrimary: "#0C3759",
  _bsSecondary: "#D0D0D0",
  _bsSuccess: "#758e4f",
  _bsInfo: "#75A0D5",
  _bsWarning: "#fbb13c",
  _bsDanger: "#ce4141",
  _bsLight: "#f4f4f4",
  _bsDark: "#1d1e1c",
};

module.exports = {
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: themeColors,
      typography: {
        DEFAULT: {
          css: {
            a: {
              color: themeColors._bsDark,
              background: "#e7ebee",
              borderTopLeftRadius: "0.25rem",
              borderTopRightRadius: "0.25rem",
              paddingLeft: "0.25rem",
              paddingRight: "0.25rem",
              fontWeight: "normal",
              textDecoration: "none",
              borderBottom: `solid 1px ${themeColors._bsInfo}`,
              "&:hover": {
                background: "#ced7de",
                color: themeColors._bsDark,
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
