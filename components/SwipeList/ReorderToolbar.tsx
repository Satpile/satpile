import {LayoutAnimation, View} from "react-native";
import React, {useLayoutEffect, useRef} from "react";
import {useTheme} from "../../utils/Theme";
import {Appbar} from "react-native-paper";
import {ListOrderType} from "../../utils/Types";
import {Toolbar} from "../Toolbar";

interface ReorderToolbarProps {
    display: boolean;
    onToggleArrows(): void; //Called to hide and show sorting arrows
    onReorder(type: ListOrderType): void; //called to dispatch reorder
    alreadySorted?: boolean;
}
export function ReorderToolbar({display, onToggleArrows, onReorder, alreadySorted}: ReorderToolbarProps) {

    const theme = useTheme();

    return (
        <Toolbar display={display}>
            <Appbar.Action color={theme.colors.onSurface} icon="sort" onPress={() => {
                onToggleArrows();
            }}/>
            <Appbar.Action  color={theme.colors.onSurface} icon="sort-alphabetical-variant" onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                if(alreadySorted){
                    onReorder("alphabetically-desc");
                }else{
                    onReorder("alphabetically");
                }
            }}/>
        </Toolbar>
    )
}

