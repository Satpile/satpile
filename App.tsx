import './shim';
import React, {useState} from 'react';
import store, {loadStore} from "./store/store";
import {StatusBar, StyleSheet, View} from 'react-native';
import {Provider} from 'react-redux';
import AppLoading from "expo-app-loading";
import AnimatedSplashScreen from "./components/AnimatedSplashScreen";
import {ToastHolder} from "./components/Toast";
import {ThemeHolder} from "./utils/Theme";
import BalanceFetcher from "./utils/BalanceFetcher";
import * as TaskManager from 'expo-task-manager';
import {Ionicons} from '@expo/vector-icons';

import {REFRESH_TASK} from "./utils/Settings";
import {Navigator} from "./navigation/Navigator";
import {Asset} from "expo-asset";
import {bootstrap} from "./utils/Bootstrap";
import LockScreen from "./screens/LockScreen";
import {useAppStateEffect} from "./utils/AppStateHook";

bootstrap();

export default function App(){
    const [loadingState, setLoadingState] = useState<"loading" | "loaded" | "after_loaded">("loading");

    if (!TaskManager.isTaskDefined(REFRESH_TASK)) {
        TaskManager.defineTask(REFRESH_TASK, BalanceFetcher.backgroundFetch);
    }

    useAppStateEffect((appState, lastAppState) => {
        if (appState === "active") {
            BalanceFetcher.filterAndFetchBalances();
        }
    })

    if (loadingState === 'loading') {
        return <AppLoading
            startAsync={preLoadAssets}
            onFinish={() => {
                BalanceFetcher.filterAndFetchBalances();
                setLoadingState("loaded")
            }}
            onError={(_)=>{}}
        />
    }

    return (
        <View style={styles.container}>
            <Provider store={store}>
                <ThemeHolder>
                    {loadingState === 'loaded' &&
                    <AnimatedSplashScreen onAnimationDone={() => setLoadingState('after_loaded')}
                                          animate={loadingState === 'loaded'}/>}
                    {loadingState === 'after_loaded' &&
                    <>
                        <StatusBar animated={true} backgroundColor={"#f47c1c"} barStyle={"light-content"}/>
                        <LockScreen>
                            <Navigator/>
                        </LockScreen>
                    </>
                    }
                    <ToastHolder/>
                </ThemeHolder>
            </Provider>
        </View>
    )
}

async function preLoadAssets() {

    const assets = [
        require('./assets/splash.png')
    ];
    const toLoad: Promise<any>[] = [
        ...assets.map(asset => Asset.fromModule(asset).downloadAsync()),
        loadStore(),
        Ionicons.loadFont()
    ];
    await Promise.all(toLoad);
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
