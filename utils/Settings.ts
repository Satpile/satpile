import {useDispatch, useSelector} from "react-redux";
import {i18n} from "../translations/i18n";
import * as Localization from "expo-localization";
import {Alert} from "react-native";
import * as Permissions from "expo-permissions";
import {PermissionType} from "expo-permissions";
import { Appearance } from "react-native-appearance";

export const REFRESH_TASK = "REFRESH_TASK";

export interface Settings {
    locale: string;
    refresh: number;
    darkMode: boolean;
}


export function defaultSettings(): Settings {
    return {
        locale: Localization.locale,
        refresh: -1,
        darkMode: Appearance.getColorScheme() === "dark",
    }
}

/**
 * hook used to get settings and update settings
 * components using this hook are automatically updated with the new version when the settings change
 */
export function useSettings(): [Settings, (settings: Partial<Settings>) => void] {
    const dispatch = useDispatch();
    const settings = useSelector(state => ({settings: state.settings})).settings;
    const updateSettings = (newSettings: Partial<Settings>) => {
        dispatch({type: 'UPDATE_SETTINGS', settings: newSettings});
    }

    return [settings, updateSettings]
};

/**
 * Asks for permission and show error message on failure
 * @param permission
 * @param errorMessage
 */
export async function askPermission(permission: PermissionType, errorMessage: string):Promise<boolean> {
    const { status: existingStatus } = await Permissions.getAsync(permission);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(permission);
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        await new Promise(resolve => { //Promisify Alert.alert
            Alert.alert(i18n.t('error'), errorMessage, [{
                onPress: resolve
            }], {
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
