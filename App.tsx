import React, {useEffect, useState} from 'react';
import store, {loadStore} from "./store/store";
import {AppState, StatusBar, StyleSheet, View} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import FoldersListScreen from "./screens/FoldersListScreen";
import {Provider} from 'react-redux';
import {SplashScreen} from "expo";
import FolderContentScreen from "./screens/FolderContentScreen";
import AddScreen from "./screens/AddScreen";
import SettingsScreen from "./screens/SettingsScreen";
import AddressDetailsScreen from "./screens/AddressDetailsScreen";
import AnimatedSplashScreen from "./components/AnimatedSplashScreen";
import {ToastHolder} from "./components/Toast";
import theme from "./utils/Theme";
import BalanceFetcher from "./utils/BalanceFetcher";
import SettingsEditScreen from "./screens/settings/SettingsEditScreen";
import * as TaskManager from 'expo-task-manager';

import {REFRESH_TASK} from "./utils/Settings";

const Stack = createStackNavigator();

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
        case 'loading':
            return <AnimatedSplashScreen animate={loadingState === 'after_loaded'}
                                         onAnimationDone={() => setLoadingState('loaded')}/>;
    }

    return (
        <View style={styles.container}>
            <Provider store={store}>
                <PaperProvider theme={theme}>
                    <StatusBar animated={false} backgroundColor={"#f47c1c"}/>
                    <NavigationContainer>
                        <Stack.Navigator
                            screenOptions={{
                                headerStyle: {
                                    backgroundColor: '#f47c1c',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: '300'
                                },
                                headerTitleContainerStyle: {
                                    width: '100%',
                                    paddingHorizontal: 52
                                },
                                headerTitleAlign: 'center'
                            }}
                        >
                            <Stack.Screen name="Home" component={FoldersListScreen}/>
                            <Stack.Screen name="FolderContent" component={FolderContentScreen}/>
                            <Stack.Screen name="Add" component={AddScreen}/>
                            <Stack.Screen name="Settings" component={SettingsScreen}/>
                            <Stack.Screen name="AddressDetails" component={AddressDetailsScreen}/>
                            <Stack.Screen name="SettingsEdit" component={SettingsEditScreen}/>
                        </Stack.Navigator>
                    </NavigationContainer>
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
