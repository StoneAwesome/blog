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
    "./src/lib/**/*.tsx",
  ],
  theme: {
    extend: {
      colors: themeColors,
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              color: themeColors._bsDark,
              background: "#e7ebee",
              borderTopLeftRadius: theme("borderRadius.DEFAULT"),
              borderTopRightRadius: theme("borderRadius.DEFAULT"),
              paddingLeft: theme("spacing.2"),
              paddingRight: theme("spacing.2"),
              fontWeight: "normal",
              textDecoration: "none",
              borderBottom: `solid ${theme("borderWidth.DEFAULT")} ${theme(
                "colors._bsInfo"
              )}`,
              transitionProperty: "all",
              transitionTimingFunction: theme(
                "transitionTimingFunction.DEFAULT"
              ),
              transitionDuration: theme("transitionDuration.DEFAULT"),
              "&:hover": {
                background: "#ced7de",
                paddingLeft: theme("spacing.3"),
                paddingRight: theme("spacing.3"),
                color: themeColors._bsDark,
              },
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
