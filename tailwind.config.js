import colors from "./src/settings/index";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        huge: "66px",
        bigger: "60px",
        big: "52px",
        med: "28px",
        small: "24px",
        smaller: "20px",
        tiny: "18px",
        mobileHuge: "40px",
        mobileBigger: "34px",
        mobileBig: "26px",
        mobileMed: "22px",
        mobileSmall: "19px",
        mobileSmaller: "16px",
        mobileTiny: "14px",
      },
      fontFamily: {
        light: "SSTLight",
        medium: "SSTMEDIUM",
        bold: "SSTBOLD",
      },
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        third: colors.third,
        fourth: colors.fourth,
        fifth: colors.fifth,
      },
      backgroundImage: {
        gradiant: `linear-gradient(179.38deg, ${colors.primary} 0%, ${colors.secondary} 70%)`,
      },
      backgroundColor: {},
    },
  },
  plugins: [],
};
