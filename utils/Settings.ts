import {useDispatch, useSelector} from "react-redux";
import {i18n} from "../translations/i18n";
import * as Localization from "expo-localization";
import {LayoutAnimation} from "react-native";

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
        darkMode: false,
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
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        dispatch({type: 'UPDATE_SETTINGS', settings: newSettings});
    }

    return [settings, updateSettings]
};

export function useI18n() {
    const [settings] = useSettings();
    return i18n;
}

/**
 * Convert a duration in second to a localized string in minutes (-1 = "Manual", [0;+oo[ = x minutes)
 * @param duration
 */
export function durationToText(duration) {
    return duration === -1 ? i18n.t`settings.refresh_manual` : (Math.round(duration / 60) + ' ' + i18n.t`minutes`)
}
