import * as Actions from "../store/actions";
import NetInfo from '@react-native-community/netinfo';
import Mempool from "./explorers/Mempool";
import store from "../store/store";
import {Toast} from "../components/Toast";
import {i18n} from '../translations/i18n';
import {Explorer} from "./Types";
import * as BackgroundFetch from "expo-background-fetch";
import {Platform, StatusBar} from "react-native";

export default class BalanceFetcher {

    static showNetworkActivity(show: boolean) {
        if (Platform.OS === "ios") {
            StatusBar.setNetworkActivityIndicatorVisible(show);
        }
    }

    static async filterAndFetchBalances(showError: boolean = true) {
        this.showNetworkActivity(true);
        let networkState = await NetInfo.fetch();
        this.showNetworkActivity(false);
        if (networkState.isConnected) {
            this.showNetworkActivity(true);
            await this.getExplorer().fetchAndUpdate(store.getState().addresses);
            BalanceFetcher.afterBalanceFetch();
            this.showNetworkActivity(false);
            return true;
        } else if (showError) {
            Toast.showToast({type: 'top', message: i18n.t('no_network'), duration: 1500})
        }

        return false;
    }

    private static getExplorer(): Explorer {
        return new Mempool();
    }

    private static afterBalanceFetch() {
        //dispatch(Actions.updateBalances(addresses));
        store.dispatch(Actions.updateFoldersTotal(store.getState().addresses));
        store.dispatch(Actions.updateLastReloadTime());
    }

    static async backgroundFetch() {
        return await BalanceFetcher.filterAndFetchBalances(false) ? BackgroundFetch.Result.NewData : BackgroundFetch.Result.Failed;
    }
}
