import {SettingsData, SettingsScreen as SettingsScreenComponent} from "@taccolaa/react-native-settings-screen";
import {List} from "react-native-paper";
import * as React from "react";
import {useTheme} from "../utils/Theme";

export function CustomSettingsScreen({settings}: { settings: SettingsData }) {
    const theme = useTheme();
    return <SettingsScreenComponent
        data={settings}
        style={{paddingTop: 20, backgroundColor: theme.colors.background}}
        rowsStyle={{backgroundColor: theme.colors.surface}}
        globalTextStyle={{color: theme.colors.text}}
        renderChevron={() => <List.Icon color={theme.chevron} icon="chevron-right"/>}
        borderColor={theme.border}
    />
}
