import { createTheme } from "@mui/material/styles";
 
const primaryMainColor = "#1976d2"; // Ana renk
const secondaryMainColor = "#388e3c"; // İkincil renk
 
const theme = createTheme({
  palette: {
    primary: {
      main: primaryMainColor,
      light: "#63a4ff", // Ana rengin açık tonu
      dark: "#004ba0", // Ana rengin koyu tonu
      contrastText: "#fff", // Ana renk üzerindeki metinlerin kontrast rengi
    },
    secondary: {
      main: secondaryMainColor,
      light: "#6abf69", // İkincil rengin açık tonu
      dark: "#005005", // İkincil rengin koyu tonu
      contrastText: "#fff", // İkincil renk üzerindeki metinlerin kontrast rengi
    },
    background: {
      default: "#F7F7F7", // Arka plan rengi,
    },
  },
  typography: {
    fontFamily: "Arial",
    fontWeightMedium: 600,
    fontSize: 17,
    h1: {
      fontSize: "2.2rem",
      fontWeight: 400,
      color: "black",
    },
    body1: {
      color: "#313131",
    },
  },
});
 
export default theme;