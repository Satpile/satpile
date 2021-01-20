import React, {useEffect, useMemo, useState} from "react";
import {TorStatusType, useTorContext} from "../utils/TorManager";
import {LayoutAnimation, Platform, View} from "react-native";
import {useI18n, useSettings} from "../utils/Settings";
import BalanceFetcher from "../utils/BalanceFetcher";
import {Text} from "react-native-paper";
import {useTheme} from "../utils/Theme";

const statusToColor = (status: TorStatusType) => {
    const theme = useTheme();
    switch (status) {
        case TorStatusType.CONNECTED: return theme.colors.success;
        case TorStatusType.CONNECTING: return theme.colors.disabled;
        case TorStatusType.DISCONNECTED: return theme.colors.error
    }
}

export function TorStatus() {
    const {state} = useTorContext();
    const [settings] = useSettings();
    const [show, setShow] = useState(false);
    const color = statusToColor(state);
    const i18n = useI18n();

    const needsTor = useMemo(() => BalanceFetcher.getExplorer(settings.explorer).needsTor(), [settings]);

    useEffect(() => {
        setShow(true);
        if(state === TorStatusType.CONNECTED && needsTor){
            const timeout = setTimeout(() => {
                setShow(show => {
                    if(show && Platform.OS === "ios"){
                        LayoutAnimation.configureNext(LayoutAnimation.create(200, LayoutAnimation.Types.easeInEaseOut));
                    }

                    return false;
                });
            }, 1500);
            return () => clearTimeout(timeout);
        }
    }, [state, settings.explorer]);

    return <View style={{
        backgroundColor: color,
        paddingVertical: (show && needsTor) ? 2 : 0,
        height: (show && needsTor) ? undefined : 0
    }}><Text style={{
        color: (show && needsTor) ? "rgb(255,255,255)" : "rgba(0,0,0,0)",
        textAlign: "center",
    }}>{i18n.t(`tor.status.${state}`)}</Text></View>
}
