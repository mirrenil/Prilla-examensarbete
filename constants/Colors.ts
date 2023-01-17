// const tintColorLight = "#783bc9";
// const tintColorDark = "#fff";
const primaryPurple = "#783BC9";
const activteColor = "#FFFD54";

export const gradientLight = {
  from: "#fff",
  to: "#783BC9",
};

export const gradientDark = {
  from: "#1F1324",
  to: "#1A0831",
};

export default {
  light: {
    text: "#1B1324",
    header: "#fff",
    menu: "#783BC9",
    background: "#EBE6F3",
    primary: {
      normal: primaryPurple,
      dark: "#4F2586",
    },
    secondary: "#FFFD54",
    grey: {
      light: "#B7B6BB",
      dark: "#3E394F",
    },
    section: "rgba(56,47,68,0.7)",

    folderTabActive: primaryPurple,
    folderTabInActive: primaryPurple,
    tint: activteColor,
    tabIconDefault: "#d9d9d9",
    tabIconSelected: primaryPurple,
  },
  dark: {
    text: "#fff",
    header: "#1B1324",
    background: "transparent",
    menu: "#1B1324",
    primary: {
      normal: primaryPurple,
      dark: "#4F2586",
    },
    secondary: "#FFFD54",
    grey: {
      light: "#B7B6BB",
      dark: "#3E394F",
    },
    section: "rgba(56,47,68,0.7)",

    tint: primaryPurple,
    folderTabActive: primaryPurple,
    folderTabInActive: primaryPurple,
    // tint: tintColorDark,
    tabIconDefault: "#404040",
    tabIconSelected: primaryPurple,
  },
};
