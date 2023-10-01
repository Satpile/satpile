import { i18n } from "../translations/i18n";
import { Alert, Platform } from "react-native";
import * as Linking from "expo-linking";
import { CustomExplorerOptions, ExplorerApi, Settings } from "./Types";
import React, { useCallback, useContext } from "react";
import { explorersByExplorerApi } from "./explorers/Explorers";
import * as Camera from "expo-camera";
import * as Notifications from "expo-notifications";
import { PermissionStatus } from "expo-modules-core";
import { useTypedDispatch, useTypedSelector } from "../store/store";
import { ActionType } from "../store/actions/actions";

export function defaultCustomElectrum(): CustomExplorerOptions {
  return {
    type: "electrum",
    options: {
      port: 50002,
      protocol: "tls",
      host: "electrum.blockstream.info",
    },
  };
}

/**
 * hook used to get settings and update settings
 * components using this hook are automatically updated with the new version when the settings change
 */
export function useSettings() {
  const dispatch = useTypedDispatch();
  const settings = useTypedSelector((state) => ({
    settings: state.settings,
  })).settings;
  const updateSettings = useCallback(
    (newSettings: Partial<Settings>) => {
      dispatch({ type: ActionType.UPDATE_SETTINGS, settings: newSettings });
    },
    [dispatch]
  );

  return [settings, updateSettings] as const;
}

export type PermissionType = "camera" | "notifications";
// | 'cameraRoll'
// | 'mediaLibrary'
// | 'mediaLibraryWriteOnly'
// | 'audioRecording'
// | 'location'
// | 'locationForeground'
// | 'locationBackground'
// | 'userFacingNotifications'
// | 'contacts'
// | 'calendar'
// | 'reminders'
// | 'motion'
// | 'systemBrightness'

const getStatusFromPermissionType = async (permission: PermissionType) => {
  switch (permission) {
    case "camera":
      return Camera.getCameraPermissionsAsync();
    case "notifications":
      return Notifications.getPermissionsAsync();
  }
  return null;
};

const askPermissionForType = async (permission: PermissionType) => {
  switch (permission) {
    case "camera":
      return Camera.requestCameraPermissionsAsync();
    case "notifications":
      return Notifications.requestPermissionsAsync();
  }
  return null;
};

/**
 * Asks for permission and show error message on failure
 * @param permission
 * @param errorMessage
 */
export async function askPermission(
  permission: PermissionType,
  errorMessage: string
): Promise<boolean> {
  const { status: existingStatus } = (await getStatusFromPermissionType(
    permission
  )) || { status: PermissionStatus.UNDETERMINED };

  let finalStatus = existingStatus;
  if (existingStatus !== PermissionStatus.GRANTED) {
    const { status } = (await askPermissionForType(permission)) || {
      status: PermissionStatus.UNDETERMINED,
    };
    finalStatus = status;
  }
  if (finalStatus !== PermissionStatus.GRANTED) {
    await new Promise<void>((resolve) => {
      //Promisify Alert.alert
      Alert.alert(
        i18n.t("error"),
        errorMessage,
        [
          {
            text: i18n.t("goto_settings"),
            onPress: () => {
              resolve();
              if (Platform.OS === "ios") {
                Linking.openURL("app-settings:");
              } else {
                Linking.openSettings();
              }
            },
          },
          {
            onPress: () => resolve(),
            style: "destructive",
            text: i18n.t("cancel"),
          },
        ],
        {
          cancelable: true,
          onDismiss: resolve,
        }
      );
    });

    return false;
  }

  return true;
}

export function useI18n() {
  useSettings();
  return i18n;
}

/**
 * Convert a duration in second to a localized string in minutes (-1 = "Manual", [0;+oo[ = x minutes)
 * @param duration
 */
export function durationToText(duration: number) {
  return duration === -1
    ? i18n.t("settings.refresh_manual")
    : Math.round(duration / 60) + " " + i18n.t("minutes");
}

export const LockScreenContext = React.createContext({
  locked: false,
  lock: () => {},
  enabled: false,
  biometricUnlocking: false,
  setBiometricUnlocking: (_biometricUnlocking: boolean) => {},
});
export const LockContextConsumer = LockScreenContext.Consumer;

export const useLockState = () => {
  return useContext(LockScreenContext);
};

export function explorerToName(explorer: ExplorerApi) {
  switch (explorer) {
    case ExplorerApi.CUSTOM:
      return i18n.t("settings.explorer.custom");
    default:
      return explorersByExplorerApi[explorer].name;
  }
}
