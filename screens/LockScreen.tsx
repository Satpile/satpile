import React, {useEffect, useState} from "react";
import {ActivityIndicator, LayoutAnimation, Platform, StyleSheet, View} from "react-native";
import {BlurView} from "expo-blur";
import {Button, IconButton, Paragraph, TextInput} from "react-native-paper";
import {LockScreenContext, useSettings} from "../utils/Settings";
import {useTheme} from "../utils/Theme";
import LocalAuth, {AuthResult} from "../utils/LocalAuth";
import {checkPassword} from "../utils/Passphrase";
import {Toast} from "../components/Toast";
import {useAppStateEffect} from "../utils/AppStateHook";
import {i18n} from "../translations/i18n";
import {BiometricButton} from "../components/BiometricButton";

export default function LockScreen({children}) {
    const [settings] = useSettings();
    const [locked, setLocked] = useState(!!settings.security.passphrase);
    const [biometricUnlocking, setBiometricUnlocking] = useState(false);

    useAppStateEffect((appState, last) => {
        if(!settings.security.passphrase){
            unlock();
            return;
        }

        if(!last){ //Lock on first open (should be locked anyway)
            lock();
            challengeUnlock(); //Prompt unlock if locked
            return;
        }

        if(last === "active" && appState !== "active" && !biometricUnlocking){
            //If the app becomes inactive but not because of unlocking (faceid prompt)
            lock();
            return;
        }

        if(last !== "active" && appState === "active" && !biometricUnlocking && settings.security.enableBiometrics && locked){
            //if the app becomes active, and we were not already using the biometric unlocking, we show the biometric challenge
            challengeUnlock();
        }
    }, [settings, locked, biometricUnlocking]);

    const challengeUnlock = () => {
        if(settings.security.enableBiometrics){
            setBiometricUnlocking(true);
            LocalAuth.promptLocalAuth().then(result => {
                switch (result) {
                    case AuthResult.SUCCESS:
                        unlock();
                        break;
                    case AuthResult.UNAVAILABLE:
                    case AuthResult.FAIL:
                        //no op
                        break;
                }
            }).finally(() => {
                setBiometricUnlocking(false);
            })
        }
    }


    const lock = () => {
        if(!locked) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }
        setLocked(true);
    }

    const unlock = () => {
        setLocked(false);
        setBiometricUnlocking(false);
    }

    return (
        <LockScreenContext.Provider value={{
            locked,
            lock,
            enabled: !!settings.security.passphrase,
            biometricUnlocking,
            setBiometricUnlocking
        }}>
            {children}
            {locked && <FrontLockScreen onAskBiometric={challengeUnlock} onAskUnlock={async (passphrase) => {
                if(await checkPassword(passphrase, settings.security.passphrase)){
                    setTimeout(unlock, 0);
                    return true;
                }else{
                    Toast.showToast({
                        duration: 1500,
                        message: "Wrong passphrase",
                        type: "top"
                    });
                    return false;
                }
            }} />}
        </LockScreenContext.Provider>
    );

}

const FrontLockScreen = ({onAskUnlock, onAskBiometric}) => {
    const theme = useTheme();
    const [input, setInput] = useState("");
    const [checking, setChecking] = useState(false);
    const [settings] = useSettings();
    const [biometricType, setBiometricType] = useState(LocalAuth.CACHED_AVAILABLE_BIOMETRIC);

    useEffect(() => {
        (async () => {
            if(settings.security.enableBiometrics){
                setBiometricType(await LocalAuth.getAvailableBiometric());
            }
        })()
    }, [settings]);

    const onSubmit = async (input) => {
        setChecking(true);
        try{
            await onAskUnlock(input)
        }finally {
            setChecking(false);
        }
    }

    const content = <>
        <View style={{
            flex: 1,
            justifyContent: "space-around",
            flexDirection: "column"
        }}>

            <Paragraph style={{
                textAlign: "center"
            }}>{i18n.t("settings.security.enter_passphrase")}</Paragraph>
            <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.primary
            }}>
                <TextInput
                    theme={{
                        ...theme,
                        colors: {
                            ...theme.colors,
                            primary: "transparent" //Get rid of the underline
                        }
                    }}
                    selectionColor={theme.colors.primary}
                    secureTextEntry={true}
                    value={input}
                    onChangeText={setInput}
                    placeholder={i18n.t("settings.security.passphrase")}
                    style={{
                        height: 48,
                        backgroundColor: 'rgba(0,0,0,0)',
                        flex: 1,
                    }}
                    underlineColor={"transparent"}
                    defaultValue={""}
                    autoFocus={true}
                    blurOnSubmit={false}
                    enablesReturnKeyAutomatically={true}
                    returnKeyType={"done"}
                    autoCompleteType={'off'}
                    onSubmitEditing={() => onSubmit(input)}
                    keyboardAppearance={settings.darkMode ? "dark" : "light"}
                />
                {settings.security.enableBiometrics && <BiometricButton onPress={onAskBiometric} type={biometricType} /> }
            </View>
            <View style={{
                height: 40,
                paddingHorizontal: 40,
                display: "flex",
                justifyContent: "center"
            }}>
            {checking ? <ActivityIndicator size="small" /> : <Button onPress={() => onSubmit(input)}>{i18n.t("settings.security.unlock")} </Button> }
            </View>
        </View>
    </>;

    if(Platform.OS === "android"){
        return <View style={{
            ...styles.frontLockScreen,
            backgroundColor: theme.colors.background
        }}>
            <View style={styles.lockScreenContent}>
                {content}
            </View>
        </View>
    }
    return <BlurView
        intensity={100}
        style={styles.frontLockScreen}
    >
        <View style={styles.lockScreenContent}>
            {content}
        </View>
    </BlurView>
}

const styles = StyleSheet.create({
    frontLockScreen: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        flexDirection: "row"
    },
    lockScreenContent: {
        height: 150,
        flex: 1,
        paddingHorizontal: 50,
        justifyContent: "center",
        marginTop: 200

    }
})
