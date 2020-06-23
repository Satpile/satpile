import {LayoutAnimation, View} from "react-native";
import React, {useLayoutEffect, useRef} from "react";
import {useTheme} from "../../utils/Theme";
import {Appbar} from "react-native-paper";
import {ListOrderType} from "../../utils/Types";
import {LockContextConsumer} from "../../screens/LockScreen";

interface ReorderToolbarProps {
    display: boolean;
    onToggleArrows(): void; //Called to hide and show sorting arrows
    onReorder(type: ListOrderType): void; //called to dispatch reorder
    onHide(): void; // called to dismiss toolbar
    alreadySorted?: boolean;
}
export function ReorderToolbar({display, onHide, onToggleArrows, onReorder, alreadySorted}: ReorderToolbarProps) {

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
            <Appbar.Action color={theme.colors.onBackground} icon="sort" onPress={() => {
                onToggleArrows();
            }}/>
            <Appbar.Action  color={theme.colors.onBackground} icon="sort-alphabetical" onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                if(alreadySorted){
                    onReorder("alphabetically-desc");
                }else{
                    onReorder("alphabetically");
                }
            }}/>
            <LockContextConsumer>{({enabled, lock, locked}) => {
                return enabled ? <Appbar.Action color={theme.colors.onBackground} icon="lock" onPress={lock}/> : null;
            }}</LockContextConsumer>
        </View>
    )
}

