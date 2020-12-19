import * as Actions from "../store/actions";
import NetInfo from '@react-native-community/netinfo';
import Mempool from "./explorers/Mempool";
import store from "../store/store";
import {Toast} from "../components/Toast";
import {i18n} from '../translations/i18n';
import {Explorer, ExplorerApi, Folder} from "./Types";
import * as BackgroundFetch from "expo-background-fetch";
import {Platform, StatusBar} from "react-native";
import {Notifications} from "./Notifications";
import {DERIVATION_BATCH_SIZE, generateNextNAddresses, shouldDeriveMoreAddresses} from "./XPubAddresses";
import {Electrum} from "./explorers/Electrum";

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
            const diff = await this.getExplorer(store.getState().settings.explorer).fetchAndUpdate(store.getState().addresses);
            BalanceFetcher.afterBalanceFetch(showError);
            this.showNetworkActivity(false);
            return diff;
        } else if (showError) {
            Toast.showToast({type: 'top', message: i18n.t('no_network'), duration: 1500})
        }

        return null;
    }

    private static getExplorer(explorer: ExplorerApi): Explorer {
        switch (explorer) {
            case ExplorerApi.BLOCKSTREAM_INFO: return new Mempool("https://blockstream.info");
            case ExplorerApi.CUSTOM:
                return this.getCustomExplorerInstance();
            default:
            case ExplorerApi.MEMPOOL_SPACE: return new Mempool("https://mempool.space");
        }
    }

    private static getCustomExplorerInstance() {
        const settings = store.getState().settings;
        if(settings.explorer === ExplorerApi.CUSTOM && settings.explorerOption){
            switch(settings.explorerOption.type){
                case "electrum": return new Electrum(settings.explorerOption.options);
            }
        }

        return null;

    }

    private static afterBalanceFetch(showError: boolean) {
        store.dispatch(Actions.updateFoldersTotal(store.getState().addresses));
        store.dispatch(Actions.updateLastReloadTime());
        let shouldRefresh = false;
        store.getState().folders.forEach((folder: Folder) => {
            if(folder.xpubConfig){
                if(folder.xpubConfig.branches){
                    folder.xpubConfig.branches.map(branch => {
                        if(shouldDeriveMoreAddresses(folder, branch, store.getState().addresses)){
                            shouldRefresh = true;
                            const newAddresses = generateNextNAddresses(folder, branch, DERIVATION_BATCH_SIZE);
                            store.dispatch(Actions.addDerivedAddresses(folder, branch, newAddresses));
                        }
                    })
                }
            }
        })

        if(shouldRefresh){
            this.filterAndFetchBalances(showError);
        }
    }

    static async backgroundFetch() {
        try{
            const diffs = await BalanceFetcher.filterAndFetchBalances(false);
            await Notifications.sendUpdateNotification(diffs);

            return diffs.length ? BackgroundFetch.Result.NewData : BackgroundFetch.Result.Failed;
        }catch(e){
            return BackgroundFetch.Result.Failed;
        }
    }
}
