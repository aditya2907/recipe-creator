import React from "react";
import RecipeCreator from "./components/RecipeCreator";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976D2", // MUI blue
    },
    secondary: {
      main: "#FF4081", // Pink
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <RecipeCreator />
    </ThemeProvider>
  );
};

export default App;
