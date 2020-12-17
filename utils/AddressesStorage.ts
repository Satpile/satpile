import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from "react-native";

export default class AddressesStorage {

    static defaultState = {
        folders: [],
        lastReloadTime: '',
        addresses: {}
    };

    static async saveState(state) {
        try {
            await AsyncStorage.setItem('state', JSON.stringify(state));
        } catch (error) {
            console.error(error);
        }
    }

    static async retrieveOldStorage(){
        if(Platform.OS !== "ios"){
            return null;
        }

        return null;

    }

    static async loadState() {
        try {
            const rawData = (await AsyncStorage.getItem('state')) || (await this.retrieveOldStorage()); // Prevents dataloss from updating app
            if (rawData === null) return this.defaultState;

            return JSON.parse(rawData);
        } catch (error) {
            console.log(error);
            return this.defaultState;
        }
    }
}

