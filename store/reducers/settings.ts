import { Action } from "../actions/actions";
import { ExplorerApi, Settings } from "../../utils/Types";
import * as Localization from "expo-localization";
import { Appearance } from "react-native";

export function defaultSettings(): Settings {
  return {
    locale: Localization.locale,
    refresh: -1,
    darkMode: Appearance.getColorScheme() === "dark",
    foldersOrder: "custom",
    security: {
      passphrase: null,
      enableBiometrics: false,
    },
    explorer: ExplorerApi.MEMPOOL_SPACE,
    displayUnit: "sats",
    hideEmptyAddresses: false,
  };
}

const settings = (state: Partial<Settings> = {}, action: Action): Settings => {
  const normalizedSettings = { ...defaultSettings(), ...state };

  switch (action.type) {
    case "LOAD_DATA":
      //When we load the data from memory we want to merge the saved settings with the default settings
      if (action.state?.settings?.explorer === "SMARTBIT_COM_AU") {
        action.state.settings.explorer = ExplorerApi.MEMPOOL_SPACE;
      }

      if (action.state?.settings?.locale === "cz") {
        action.state.settings.locale = "cs";
      }
      return { ...defaultSettings(), ...action.state.settings };

    case "UPDATE_SETTINGS":
      //When we update some settings, we want to merge the existing settings with the new settings and the default
      return { ...normalizedSettings, ...action.settings };

    case "CLEAR":
      //When we reset the settings we just return a copy of the default settings
      return { ...defaultSettings() };
    case "SORT_FOLDERS":
      return { ...normalizedSettings, foldersOrder: action.foldersOrder };
    case "SWAP_FOLDERS":
      return { ...normalizedSettings, foldersOrder: "custom" };

    default:
      return normalizedSettings;
  }
};

export default settings;
