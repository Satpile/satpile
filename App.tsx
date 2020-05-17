import React, {useEffect, useState} from 'react';
import store, {loadStore} from "./store/store";
import {AppState, Platform, StatusBar, StyleSheet, UIManager, View} from 'react-native';
import {Provider} from 'react-redux';
import {AppLoading, SplashScreen} from "expo";
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

bootstrap();

export default function App(){
    const [loadingState, setLoadingState] = useState<"loading" | "loaded" | "after_loaded">("loading");
    const [appState, setAppState] = useState(AppState.currentState);

    if (!TaskManager.isTaskDefined(REFRESH_TASK)) {
        TaskManager.defineTask(REFRESH_TASK, BalanceFetcher.backgroundFetch);
    }

    useEffect(() => {
        AppState.addEventListener("change", _handleAppStateChange);

        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
        };
    }, []);

    const _handleAppStateChange = nextAppState => {
        if (nextAppState === "active") {
            BalanceFetcher.filterAndFetchBalances();
        }
        setAppState(nextAppState);
    };

    if (loadingState === 'loading') {
        return <AppLoading
            startAsync={preLoadAssets}
            onFinish={() => {
                BalanceFetcher.filterAndFetchBalances();
                setLoadingState("loaded")
            }}
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
                        <Navigator/>
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
    const toLoad = [
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
