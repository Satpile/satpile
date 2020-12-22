import * as Actions from "../store/actions";
import NetInfo from '@react-native-community/netinfo';
import Mempool from "./explorers/Mempool";
import store from "../store/store";
import {Toast} from "../components/Toast";
import {i18n} from '../translations/i18n';
import {AddressesList, Explorer, ExplorerApi, Folder} from "./Types";
import * as BackgroundFetch from "expo-background-fetch";
import {Platform, StatusBar} from "react-native";
import {Notifications} from "./Notifications";
import {DERIVATION_BATCH_SIZE, generateNextNAddresses, shouldDeriveMoreAddresses} from "./XPubAddresses";
import {Electrum} from "./explorers/Electrum";
import TradeBlock from "./explorers/TradeBlock";
import SmartBit from "./explorers/SmartBit";
import BlockCypher from "./explorers/BlockCypher";
import {AddressStatusType} from "../components/AddressStatus";

export default class BalanceFetcher {

    static showNetworkActivity(show: boolean) {
        if (Platform.OS === "ios") {
            StatusBar.setNetworkActivityIndicatorVisible(show);
        }
    }

    static getErroredAddresses() {
        return Object
            .entries(store.getState().addresses)
            .reduce((list, [address, value]) => {
                if(value.status === AddressStatusType.ERROR){
                    return {
                        ...list,
                        [address]: value
                    }
                }
                return list;
            }, {});
    }

    static async filterAndFetchBalances(showError: boolean = true, onlyErrorAddresses = false) {
        const addressesToFetch : AddressesList = onlyErrorAddresses ?
            this.getErroredAddresses() : store.getState().addresses;

        if(Object.keys(addressesToFetch).length === 0){
            return null;
        }

        this.showNetworkActivity(true);
        let networkState = await NetInfo.fetch();
        this.showNetworkActivity(false);
        if (networkState.isConnected) {
            this.showNetworkActivity(true);

            const diff = await this.getExplorer(store.getState().settings.explorer).fetchAndUpdate(addressesToFetch);
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
            case ExplorerApi.TRADEBLOCK_COM: return new TradeBlock();
            case ExplorerApi.SMARTBIT_COM_AU: return new SmartBit();
            //case ExplorerApi.BLOCKCYPHER_COM: return new BlockCypher(); //Disabled because of rate limit
            case ExplorerApi.CUSTOM:
                return this.getCustomExplorerInstance();
            default:
            case ExplorerApi.MEMPOOL_SPACE: return new Mempool("https://mempool.space", 1000/50);
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
