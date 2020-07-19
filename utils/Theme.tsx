import {
    DarkTheme,
    DefaultTheme,
    Provider as PaperProvider,
    useTheme as useRnPaperTheme
} from "react-native-paper";
import React, {createContext} from "react";
import {useSettings} from "./Settings"

type RNPaperTheme = ReactNativePaper.Theme;

interface Theme extends RNPaperTheme {
    chevron,
    border,
    settingsValue
}

const lightTheme: Theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#f47c1c',
        background: 'hsl(0, 0%, 97%)'
    },
    chevron: '#c0c0c2',
    border: '#c8c8c8',
    settingsValue: '#888888'
};

const darkTheme: Theme = {
    ...DarkTheme,
    roundness: 2,
    colors: {
        ...DarkTheme.colors,
        primary: '#f47c1c',
        surface: '#1c1c1e',
    },
    chevron: '#616065',
    border: '#413f44',
    settingsValue: '#888888'
};
const Themes = {lightTheme, darkTheme};

const ThemeContext = createContext({
    theme: lightTheme,
});

const ThemeHolder = ({children}) => {
    const [settings] = useSettings();
    const theme = settings.darkMode ? darkTheme : lightTheme;
    return <PaperProvider theme={theme}>
        {children}
    </PaperProvider>
}

export function useTheme(): Theme {
    return useRnPaperTheme() as Theme;
}

export {ThemeHolder, Themes};
