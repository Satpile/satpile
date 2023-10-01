import {
  DarkTheme,
  DefaultTheme,
  Provider as PaperProvider,
  useTheme as useRnPaperTheme,
} from "react-native-paper";
import React from "react";
import { useSettings } from "./Settings";

type RNPaperTheme = ReactNativePaper.Theme;

interface Theme extends RNPaperTheme {
  chevron: string;
  border: string;
  settingsValue: string;
  colors: RNPaperTheme["colors"] & {
    success: string;
  };
}

const lightTheme: Theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#f47c1c",
    background: "hsl(0, 0%, 97%)",
    success: "hsl(120, 100%, 35%)",
  },
  chevron: "#c0c0c2",
  border: "#c8c8c8",
  settingsValue: "#888888",
};

const darkTheme: Theme = {
  ...DarkTheme,
  roundness: 2,
  colors: {
    ...DarkTheme.colors,
    primary: "#f47c1c",
    surface: "#1c1c1e",
    success: "hsl(120, 52%, 61%)",
  },
  chevron: "#616065",
  border: "#413f44",
  settingsValue: "#888888",
};
const Themes = { lightTheme, darkTheme };

const ThemeHolder = ({ children }: { children: React.ReactNode }) => {
  const [settings] = useSettings();
  const theme = settings.darkMode ? darkTheme : lightTheme;
  return <PaperProvider theme={theme}>{children}</PaperProvider>;
};

export function useTheme(): Theme {
  return useRnPaperTheme() as Theme;
}

export { ThemeHolder, Themes };
