import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import RNFS from "react-native-fs";
import { RootState } from "../store/store";
import { defaultSettings } from "../store/reducers/settings";

export default class AddressesStorage {
  static defaultState: RootState = {
    folders: [],
    lastReloadTime: "",
    addresses: {},
    loading: false,
    settings: defaultSettings(),
  };

  static enqueuedStateToSaveTimeout: number | null = null;
  static lastStateSavedAt = 0;

  static async saveState(state: RootState) {
    console.log("Saving state");
    const save = async () => {
      AddressesStorage.lastStateSavedAt = Date.now();
      console.log("Actually saving state");
      try {
        await AsyncStorage.setItem("state", JSON.stringify(state));
      } catch (error) {
        console.error(error);
      }
    };

    if (AddressesStorage.lastStateSavedAt + 1000 < Date.now()) {
      await save();
    } else {
      if (AddressesStorage.enqueuedStateToSaveTimeout !== null) {
        clearTimeout(AddressesStorage.enqueuedStateToSaveTimeout);
        AddressesStorage.enqueuedStateToSaveTimeout = null;
      }

      AddressesStorage.enqueuedStateToSaveTimeout = setTimeout(
        save,
        AddressesStorage.lastStateSavedAt + 1000 - Date.now()
      );
    }
  }

  // Prevents dataloss from updating app from managed to bare workflow
  static async retrieveOldStorage() {
    if (Platform.OS !== "ios") {
      return null;
    }

    try {
      //md5("state") = 9ed39e2ea931586b6a985a6942ef573e
      return await RNFS.readFile(
        RNFS.DocumentDirectoryPath +
          "/RCTAsyncLocalStorage/9ed39e2ea931586b6a985a6942ef573e"
      );
    } catch (e) {
      return null;
    }
  }

  static async loadState(): Promise<RootState> {
    try {
      const rawData =
        (await AsyncStorage.getItem("state")) ||
        (await this.retrieveOldStorage());
      if (rawData === null) return this.defaultState;

      return JSON.parse(rawData) as RootState;
    } catch (error) {
      console.log({ error });
      return this.defaultState;
    }
  }
}
