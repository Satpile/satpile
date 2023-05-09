import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import RNFS from "react-native-fs";

export default class AddressesStorage {
  static defaultState = {
    folders: [],
    lastReloadTime: "",
    addresses: {},
  };

  static async saveState(state) {
    try {
      await AsyncStorage.setItem("state", JSON.stringify(state));
    } catch (error) {
      console.error(error);
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

  static async loadState() {
    try {
      const rawData =
        (await AsyncStorage.getItem("state")) ||
        (await this.retrieveOldStorage());
      if (rawData === null) return this.defaultState;

      return JSON.parse(rawData);
    } catch (error) {
      console.log({ error });
      return this.defaultState;
    }
  }
}
