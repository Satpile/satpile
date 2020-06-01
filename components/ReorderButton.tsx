import {View} from "react-native";
import {Appbar} from "react-native-paper";
import React from "react";
import {useTheme} from "../utils/Theme";

export function ReorderButton({show, showUp, showDown, onClickUp, onClickDown}){
    const theme = useTheme();
    return show ? <View
        style={{
            height: 72,
            right:0,
            width:72,
            position: "absolute",
            backgroundColor: theme.colors.surface,
            display: "flex",
            justifyContent: "space-around",
            flexDirection: "row",
            alignItems: "center",
        }}
    >
        <Appbar.Action disabled={!showDown} key={"down"} style={{opacity: showDown ? 1 : 0}} color={theme.colors.onBackground} icon="arrow-down" onPress={onClickDown}/>
        <Appbar.Action disabled={!showUp} key={"up"} style={{opacity: showUp ? 1 : 0}} color={theme.colors.onBackground} icon="arrow-up" onPress={onClickUp}/>
    </View> : null;
}
