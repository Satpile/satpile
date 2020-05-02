import {useDispatch, useSelector} from "react-redux";
import {i18n} from "../translations/i18n";

export const REFRESH_TASK = "REFRESH_TASK";


/**
 * hook used to get settings and update settings
 * components using this hook are automatically updated with the new version when the settings change
 */
export const useSettings = () => {
    const dispatch = useDispatch();
    const settings = useSelector(state => ({settings: state.settings})).settings;
    const updateSettings = (newSettings) => {
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
