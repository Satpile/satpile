import {useDispatch, useSelector} from "react-redux";
import {i18n} from "../translations/i18n";
import * as Localization from "expo-localization";
import {Alert, Platform} from "react-native";
import * as Permissions from "expo-permissions";
import {PermissionType} from "expo-permissions";
import {Appearance} from "react-native-appearance";
import {Linking} from "expo";
import {CustomExplorerOptions, ExplorerApi, ListOrderType} from "./Types";
import React, {useCallback, useContext} from "react";
import {explorersByExplorerApi} from "./explorers/Explorers";

export const REFRESH_TASK = "REFRESH_TASK";

export type SecuritySetting = {
    enableBiometrics: false;
    passphrase: null
} | {
    enableBiometrics: boolean;
    passphrase: string
};

export interface Settings {
    locale: string;
    refresh: number;
    darkMode: boolean;
    foldersOrder: ListOrderType;
    security: SecuritySetting;
    explorer: ExplorerApi;
    explorerOption?: CustomExplorerOptions;
    displayUnit?: "sats" | "bitcoin";
    hideEmptyAddresses?: boolean;
}

export function defaultCustomElectrum(): CustomExplorerOptions {
    return{
        type: "electrum",
        options: {
            port: 50002,
            protocol: "tls",
            host: "electrum.blockstream.info",
        }
    }
}

export function defaultSettings(): Settings {
    return {
        locale: Localization.locale,
        refresh: -1,
        darkMode: Appearance.getColorScheme() === "dark",
        foldersOrder: "custom",
        security: {
            passphrase: null,
            enableBiometrics: false
        },
        explorer: ExplorerApi.MEMPOOL_SPACE,
        displayUnit: "sats",
        hideEmptyAddresses: false
    }
}

/**
 * hook used to get settings and update settings
 * components using this hook are automatically updated with the new version when the settings change
 */
export function useSettings(): [Settings, (settings: Partial<Settings>) => void] {
    const dispatch = useDispatch();
    const settings = useSelector(state => ({settings: state.settings})).settings;
    const updateSettings = useCallback((newSettings: Partial<Settings>) => {
        dispatch({type: 'UPDATE_SETTINGS', settings: newSettings});
    }, [dispatch]);

    return [settings, updateSettings]
};

/**
 * Asks for permission and show error message on failure
 * @param permission
 * @param errorMessage
 */
export async function askPermission(permission: PermissionType, errorMessage: string): Promise<boolean> {
    const {status: existingStatus} = await Permissions.getAsync(permission);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const {status} = await Permissions.askAsync(permission);
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        await new Promise(resolve => { //Promisify Alert.alert
            Alert.alert(i18n.t('error'), errorMessage, [
                {
                    text: i18n.t("goto_settings"),
                    onPress: () => {
                        resolve();
                        if (Platform.OS === 'ios') {
                            Linking.openURL("app-settings:");
                        } else {
                            Linking.openSettings();
                        }
                    }
                },
                {
                    onPress: resolve,
                    style: "destructive",
                    text: i18n.t("cancel")
                }
            ], {
                cancelable: true,
                onDismiss: resolve
            });
        })

        return false;
    }

    return true;
}

export function useI18n() {
    const [settings] = useSettings();
    return i18n;
}

/**
 * Convert a duration in second to a localized string in minutes (-1 = "Manual", [0;+oo[ = x minutes)
 * @param duration
 */
export function durationToText(duration) {
    return duration === -1 ? i18n.t("settings.refresh_manual") : (Math.round(duration / 60) + ' ' + i18n.t("minutes"))
}

export const LockScreenContext = React.createContext({
    locked: false,
    lock: () => {},
    enabled: false,
    biometricUnlocking: false,
    setBiometricUnlocking: (biometricUnlocking: boolean) => {}
})
export const LockContextConsumer = LockScreenContext.Consumer;

export const useLockState = () => {
    return useContext(LockScreenContext);
}

export function explorerToName(explorer: ExplorerApi) {
    switch (explorer) {
        case ExplorerApi.CUSTOM: return i18n.t("settings.explorer.custom");
        default: return explorersByExplorerApi[explorer].name;
    }
}
