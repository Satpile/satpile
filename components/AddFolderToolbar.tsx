import React from "react";
import {Appbar, Text} from "react-native-paper";
import {useTheme} from "../utils/Theme";
import {Toolbar} from "./Toolbar";
import {useNavigation} from '@react-navigation/native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {TouchableHighlight} from "react-native";

interface AddFolderToolbarProps {
    display: boolean;
    onHide(): void;
    onAddFolder(): void;
}
export function AddFolderToolbar({display, onHide, onAddFolder}: AddFolderToolbarProps) {

    const theme = useTheme();
    const navigation = useNavigation();

    return (
        <Toolbar display={display} style={{
            alignItems: "flex-start",
            paddingTop:display && 12,
        }}>
            <Appbar.Action style={{
                marginTop: 0
            }} color={theme.colors.onBackground} icon="folder" onPress={() => {
                onHide();
                onAddFolder();
            }}>Text</Appbar.Action>
            <TouchableHighlight style={{
                marginRight:5,
                padding: 5,
            }} onPress={() => {
                onHide();
                navigation.navigate("Add", {folder: null});
            }}><>
                <MaterialCommunityIcons name={"wallet"} color={theme.colors.onBackground} size={24} />
                <Text style={{
                    fontSize: 8
                }}>XPUB</Text>
                </>
            </TouchableHighlight>
        </Toolbar>
    )
}

