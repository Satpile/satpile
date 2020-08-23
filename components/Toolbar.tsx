import {useTheme} from "../utils/Theme";
import React, {useLayoutEffect, useRef} from "react";
import {LayoutAnimation, View} from "react-native";
import {ListOrderType} from "../utils/Types";

interface ToolbarProps {
    display: boolean;
    children: React.ReactNode;
}

export function Toolbar({children, display}: ToolbarProps) {

    const theme = useTheme();
    const hasMounted = useRef(false);
    useLayoutEffect(() => {
        if(hasMounted.current){
            LayoutAnimation.configureNext({...LayoutAnimation.Presets.easeInEaseOut, duration: 200});
        }
        hasMounted.current = true;
    }, [display]) //Animate on open and close

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
    );
}
