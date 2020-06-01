import {LayoutAnimation, View} from "react-native";
import React, {useLayoutEffect} from "react";
import {useTheme} from "../utils/Theme";

export function Toolbar({children, display}) {

    const theme = useTheme();

    useLayoutEffect(() => {
        LayoutAnimation.configureNext({...LayoutAnimation.Presets.easeInEaseOut, duration: 200});
    }, [display])

    return (
        <View style={{
            opacity: display ? 1: 0,
            height: display ? 72 : 0,
            backgroundColor: theme.colors.background,
            alignSelf: "flex-end",
            justifyContent: "flex-end",
            alignItems: "center",
            flexDirection: "row"
        }}>
            {children}
        </View>
    )
}

