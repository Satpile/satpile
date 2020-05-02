import * as Actions from "../store/actions";
import NetInfo from '@react-native-community/netinfo';
import Mempool from "./explorers/Mempool";
import store from "../store/store";
import {Toast} from "../components/Toast";
import {i18n} from '../translations/i18n';
import {Explorer} from "./Types";
import * as BackgroundFetch from "expo-background-fetch";

export default class BalanceFetcher {

    static async filterAndFetchBalances(showError: boolean = true) {
        let networkState = await NetInfo.fetch();

        if (networkState.isConnected) {
            await this.getExplorer().fetchAndUpdate(store.getState().addresses);
            BalanceFetcher.afterBalanceFetch();
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
