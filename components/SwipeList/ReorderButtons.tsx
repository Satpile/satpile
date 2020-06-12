import {LayoutAnimation, View} from "react-native";
import {Appbar} from "react-native-paper";
import React, {useLayoutEffect, useRef, useState} from "react";
import {useTheme} from "../../utils/Theme";

export function ReorderButtons({show, showUp, showDown, onClickUp, onClickDown, height = 72}){
    const [hidden, setHidden] = useState(true);
    const [render, setRender] = useState(false);
    const hasMounted = useRef(false);


    useLayoutEffect(() => {
        if(hasMounted.current){
            if(show){
                setRender(true);
                setTimeout(() => {
                        LayoutAnimation.configureNext({...LayoutAnimation.Presets.easeInEaseOut, duration: 200});
                        setHidden(false);
                }, 0);
            }else{
                setTimeout(() => {
                    LayoutAnimation.configureNext({...LayoutAnimation.Presets.easeInEaseOut, duration: 200}, () => {
                        setRender(false);
                    });
                    setHidden(true);
                }, 0);
            }

        }
        hasMounted.current = true;
    }, [show]) //Animate on open and close

    const theme = useTheme();

    if(!render){
        return null;
    }

    return <View
        style={{
            height: height,
            right:hidden ? -90 : 0,
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
        }}
    >
        <Appbar.Action disabled={!showDown} key={"down"} style={{opacity: showDown ? 1 : 0}} color={theme.colors.onBackground} icon="chevron-down" onPress={onClickDown}/>
        <Appbar.Action disabled={!showUp} key={"up"} style={{opacity: showUp ? 1 : 0}} color={theme.colors.onBackground} icon="chevron-up" onPress={onClickUp}/>
    </View>;
}
