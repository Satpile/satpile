import React, {DependencyList, EffectCallback, useContext, useEffect, useState} from "react";
import {
    ActivityIndicator,
    Alert,
    AppState,
    AppStateStatus,
    LayoutAnimation,
    Platform,
    StyleSheet,
    View
} from "react-native";
import {BlurView} from "expo-blur";
import {Button, Dialog, Paragraph, Text, TextInput} from "react-native-paper";
import {i18n} from "../translations/i18n";
import {useSettings} from "../utils/Settings";
import {useTheme} from "../utils/Theme";
import LocalAuth, {AuthResult} from "../utils/LocalAuth";
import {checkPassword} from "../utils/Passphrase";
import {Toast} from "../components/Toast";

const LockScreenContext = React.createContext({
    locked: false,
    lock: () => {},
    enabled: false
})

const useAppState = () => {
    const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
    useEffect(() => {
        AppState.addEventListener("change", _handleAppStateChange);
        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
        };
    }, []);

    const _handleAppStateChange = (state) => {
        setAppState(state);
    }

    return appState;
}

const useAppStateEffect = (effect: (appState: string) => (void | (() => void | undefined)), dependencyList?: DependencyList) => {
    const appState = useAppState();
    useEffect(() => {
        console.log(appState);
        return effect(appState);
    }, [...dependencyList, appState, effect]);
}

export const LockContextConsumer = LockScreenContext.Consumer;

export default function LockScreen({children}) {

    const [settings] = useSettings();
    const [locked, setLocked] = useState(!!settings.security.passphrase);
    const [unlocking, setUnlocking] = useState(false);

    useAppStateEffect((appState) => {
        if(unlocking){
            if(!locked){
                setUnlocking(true);
            }
            return;
        }
        if(appState === "active"){
            if(locked){
                setUnlocking(true);
            }
        }else if(!!settings.security.passphrase){
            lock();
        }
    }, [unlocking]);


    useEffect(() => {
        if(unlocking && settings.security.enableBiometrics){
            challengeUnlock();
        }
    }, [unlocking])

    const challengeUnlock = () => {
        if(settings.security.enableBiometrics){
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
    }


    const lock = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setLocked(true);
    }

    const unlock = () => {
        //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setLocked(false);
    }

    return <LockScreenContext.Provider value={{ locked, lock, enabled: !!settings.security.passphrase }}>
        {children}
        {locked && <FrontLockScreen onAskUnlock={async (passphrase) => {
            if(await checkPassword(passphrase, settings.security.passphrase)){
                unlock();
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
    </LockScreenContext.Provider>;

}

const FrontLockScreen = ({onAskUnlock}) => {
    const theme = useTheme();
    const [input, setInput] = useState("");
    const [checking, setChecking] = useState(false);
    const onSubmit = async (input) => {
        setChecking(true);
        try{
            console.info(input);
            if(!await onAskUnlock(input)){
                setInput("");
            }
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
            }}>Enter passphrase :</Paragraph>
            <TextInput
                secureTextEntry={true}
                value={input}
                onChangeText={setInput}
                placeholder={"Passphrase"}
                style={{
                    height: 48,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                }}
                defaultValue={""}
                autoFocus={true}
                blurOnSubmit={false}
                enablesReturnKeyAutomatically={true}
                returnKeyType={"done"}
                autoCompleteType={'off'}
                onSubmitEditing={() => onSubmit(input)}
            />
            <View style={{
                height: 40,
                paddingHorizontal: 40,
                display: "flex",
                justifyContent: "center"
            }}>
            {checking ? <ActivityIndicator size="small" /> : <Button onPress={() => onSubmit(input)}>Unlock </Button> }
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
