import React from "react";
import {Appbar} from "react-native-paper";
import {useTheme} from "../utils/Theme";
import {Toolbar} from "./Toolbar";

interface ReorderToolbarProps {
    display: boolean;
    onHide(): void;
}
export function AddFolderToolbar({display, onHide}: ReorderToolbarProps) {

    const theme = useTheme();

    return (
        <Toolbar display={display}>
            <Appbar.Action color={theme.colors.onBackground} icon="folder" onPress={() => {
                console.log("add simple folder");
                onHide();
            }}>Text</Appbar.Action>
            <Appbar.Action  color={theme.colors.onBackground} icon="wallet" onPress={() => {
                console.log("add xpub folder");
                onHide();
            }}/>
        </Toolbar>
    )
}

