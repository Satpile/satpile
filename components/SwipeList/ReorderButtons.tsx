import {LayoutAnimation, View} from "react-native";
import {Appbar} from "react-native-paper";
import React, {useLayoutEffect, useRef} from "react";
import {useTheme} from "../../utils/Theme";

export function ReorderButtons({show, showUp, showDown, onClickUp, onClickDown, height = 72}){

    const hasMounted = useRef(false);
    useLayoutEffect(() => {
        if(hasMounted.current){
            LayoutAnimation.configureNext({...LayoutAnimation.Presets.easeInEaseOut, duration: 200});
        }
        hasMounted.current = true;
    }, [show]) //Animate on open and close

    const theme = useTheme();
    return <View
        style={{
            height: height,
            right:0,
            width:90,
            paddingHorizontal: 8,
            position: "absolute",
            backgroundColor: theme.colors.surface,
            display: "flex",
            justifyContent: "space-around",
            flexDirection: "row",
            alignItems: "center",
            borderLeftColor: theme.colors.background,
            borderLeftWidth: 10,
            translateX: show ? 0 : 90
        }}
    >
        <Appbar.Action disabled={!showDown} key={"down"} style={{opacity: showDown ? 1 : 0}} color={theme.colors.onBackground} icon="chevron-down" onPress={onClickDown}/>
        <Appbar.Action disabled={!showUp} key={"up"} style={{opacity: showUp ? 1 : 0}} color={theme.colors.onBackground} icon="chevron-up" onPress={onClickUp}/>
    </View>;
}
