import React from "react";
import {Appbar} from "react-native-paper";
import {useTheme} from "../utils/Theme";
import {Toolbar} from "./Toolbar";
import {useNavigation} from '@react-navigation/native';

interface ReorderToolbarProps {
    display: boolean;
    onHide(): void;
    onAddFolder(): void;
}
export function AddFolderToolbar({display, onHide, onAddFolder}: ReorderToolbarProps) {

    const theme = useTheme();
    const navigation = useNavigation();

    return (
        <Toolbar display={display}>
            <Appbar.Action color={theme.colors.onBackground} icon="folder" onPress={() => {
                onHide();
                onAddFolder();
            }}>Text</Appbar.Action>
            <Appbar.Action  color={theme.colors.onBackground} icon="wallet" onPress={() => {
                onHide();
                navigation.navigate("Add", {folder: null});
            }}/>
        </Toolbar>
    )
}

