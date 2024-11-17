import React, { ReactNode } from "react";
import PropTypes from "prop-types";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
 
import theme from "./theme";
 
// ----------------------------------------------------------------------
 
interface ThemeProviderProps {
  children: ReactNode;
}
 
export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
 
ThemeProvider.propTypes = {
  children: PropTypes.node,
};