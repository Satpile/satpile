import React, {useEffect, useState} from "react";
import {Alert, AppState, AppStateStatus, LayoutAnimation, Platform, StyleSheet, View} from "react-native";
import {BlurView} from "expo-blur";
import {Button, Text} from "react-native-paper";
import {i18n} from "../translations/i18n";
import {useSettings} from "../utils/Settings";
import {useTheme} from "../utils/Theme";
import LocalAuth, {AuthResult} from "../utils/LocalAuth";

const LockScreenContext = React.createContext({
    locked: false,
    lock: () => {},
    enabled: false
})

export const LockContextConsumer = LockScreenContext.Consumer;

export default function LockScreen({children}) {

    const [settings, updateSettings] = useSettings();
    const [locked, setLocked] = useState(settings.security !== "none");
    const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
    const [unlocking, setUnlocking] = useState(false);

    useEffect(() => {
        AppState.addEventListener("change", _handleAppStateChange);
        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
        };
    }, []);

    useEffect(() => {
        if(unlocking) {
            if(!locked){
                setUnlocking(false);
            }
            return;
        }

        if(appState === "active"){
            if(locked){
                setUnlocking(true);
            }
        }else{
            lock();
        }

    }, [appState, unlocking]);

    useEffect(() => {
        if(unlocking){
            challengeUnlock();
        }
    }, [unlocking])

    const challengeUnlock = () => {
        LocalAuth.promptLocalAuth().then(result => {
            switch (result) {
                case AuthResult.SUCCESS:
                case AuthResult.UNAVAILABLE:
                    unlock();
                    break;
                case AuthResult.FAIL:
                    setUnlocking(false);
                    break;
            }
        })
    }

    const _handleAppStateChange = (state) => {
        setAppState(state);
    }



    const lock = () => {
        if(settings.security === "none") return;
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setLocked(true);
    }

    const unlock = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setLocked(false);
    }

    return <LockScreenContext.Provider value={{ locked, lock, enabled: settings.security !== "none" }}>
        {children}
        {locked && <FrontLockScreen onAskUnlock={() => setUnlocking(true)} />}
    </LockScreenContext.Provider>;

}

const FrontLockScreen = ({onAskUnlock}) => {
    const theme = useTheme();
    const content = <>
        <Text>Locked</Text>
        <Button onPress={() => onAskUnlock()}>Unlock</Button>
    </>;

    if(Platform.OS === "android"){
        return <View style={{
            ...styles.frontLockScreen,
            backgroundColor: theme.colors.background
        }}>
            {content}
        </View>
    }
    return <BlurView
        intensity={100}
        style={styles.frontLockScreen}
    >
        {content}
    </BlurView>
}

const styles = StyleSheet.create({
    frontLockScreen: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
})
