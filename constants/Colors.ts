const primaryPurple = "#783BC9";
const activteColor = "#FFFD54";

export const gradientLight = {
  from: "#CEA9FF",
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
    menu: "#fff",
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
    modal: "#fff",
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
      dark: "rgba(0,0,0,0.5)",
    },
    secondary: "#FFFD54",
    grey: {
      light: "#B7B6BB",
      dark: "#3E394F",
    },
    section: "rgba(56,47,68,0.7)",
    modal: "#2E233B",
    tint: primaryPurple,
    folderTabActive: primaryPurple,
    folderTabInActive: primaryPurple,
    tabIconDefault: "#404040",
    tabIconSelected: primaryPurple,
  },
};
