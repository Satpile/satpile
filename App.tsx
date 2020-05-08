import React, {useEffect, useState} from 'react';
import store, {loadStore} from "./store/store";
import {AppState, StatusBar, StyleSheet, View} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider} from 'react-redux';
import {SplashScreen} from "expo";
import AnimatedSplashScreen from "./components/AnimatedSplashScreen";
import {ToastHolder} from "./components/Toast";
import theme from "./utils/Theme";
import BalanceFetcher from "./utils/BalanceFetcher";
import * as TaskManager from 'expo-task-manager';

import {REFRESH_TASK} from "./utils/Settings";
import {Navigator} from "./navigation/Navigator";

SplashScreen.preventAutoHide();
TaskManager.defineTask(REFRESH_TASK, BalanceFetcher.backgroundFetch);

export default function App(){
    const [loadingState, setLoadingState] = useState('none'); //none, loading, loaded
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


    switch (loadingState) {
        case 'none':
            setLoadingState('loading');
            (async () => {
                await loadStore();
                setLoadingState('after_loaded');
            })();
            return null;
        case 'after_loaded':
            SplashScreen.hide();
            BalanceFetcher.filterAndFetchBalances();
        case 'loading':
            return <AnimatedSplashScreen animate={loadingState === 'after_loaded'}
                                         onAnimationDone={() => setLoadingState('loaded')}/>;
    }

    return (
        <View style={styles.container}>
            <Provider store={store}>
                <PaperProvider theme={theme}>
                    <StatusBar animated={false} backgroundColor={"#f47c1c"}/>
                    <Navigator/>
                    <ToastHolder/>
                </PaperProvider>
            </Provider>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
