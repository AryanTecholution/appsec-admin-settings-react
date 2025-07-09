import { Button, ThemeProvider, createTheme } from "@mui/material";
import React from "react";

interface CustomPaletteOptions {
  primary: {
    main: string;
    contrastText: string;
  };
  secondary: {
    main: string;
    contrastText: string;
  };
  danger: {
    main: string;
    contrastText: string;
  };
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#000",
      contrastText: "#fff",
    },
    secondary: {
      main: "#512CED",
      contrastText: "#fff",
    },
    warning: {
      main: "#2c3227",
      contrastText: "#fff",
    },
    error: {
      main: "#e57373",
      contrastText: "#fff",
    },
    info: {
      main: "#ECEDF5",
      contrastText: "#4C5AD4",
    },
  },
});

interface ButtonProps {
  buttonText: string;
  buttonColor: "primary" | "secondary" | "warning" | "error" | "info";
  handleClick: () => void;
  width?: number;
}

const SettingsButton: React.FC<ButtonProps> = ({
  buttonText,
  buttonColor,
  handleClick,
  width,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <>
        {" "}
        <Button
          className="font-bold text-medium"
          variant="contained"
          color={buttonColor}
          style={{
            background: theme.palette[buttonColor].main,
            height: "3rem",
            minWidth: "8rem",
            width: width ? `${width}rem` : "auto",
          }}
          onClick={handleClick}
          // disabled={buttonColor === "warning"}
        >
          {buttonText}
        </Button>
      </>
    </ThemeProvider>
  );
};

export default SettingsButton;
