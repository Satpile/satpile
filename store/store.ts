import {createStore} from "redux";
import rootReducer from './reducers';
import * as Actions from './actions';
import AddressesStorage from "../utils/AddressesStorage";
import {updateLocale} from "../translations/i18n";
import * as BackgroundFetch from "expo-background-fetch";
import {REFRESH_TASK} from "../utils/Settings";
import * as TaskManager from 'expo-task-manager';

const store = createStore(rootReducer);
let storeLoaded = false;

export async function loadStore() {
    if (!storeLoaded) {
        storeLoaded = true;
        store.dispatch(await Actions.loadData())
        console.log(store.getState());
    }
}


store.subscribe(async () => {

    // fixes state reset due to race condition
    if (Object.keys(store.getState()).length === 0) { //if current state is empty
        if (!storeLoaded) {
            storeLoaded = true;
            await loadStore();
        }
        return;
    }


    if (store) {
        await AddressesStorage.saveState(store.getState());
        if (store.getState().settings.locale !== undefined) {
            updateLocale(store.getState().settings.locale);
        }

        if (store.getState().settings.refresh !== undefined) {
            if (store.getState().settings.refresh === -1) {
                if (TaskManager.isTaskDefined(REFRESH_TASK) && await TaskManager.isTaskRegisteredAsync(REFRESH_TASK)) {
                    BackgroundFetch.unregisterTaskAsync(REFRESH_TASK).catch(err => console.log('STORE', 'err', err));
                }
            } else {
                BackgroundFetch.registerTaskAsync(REFRESH_TASK, {
                    minimumInterval: store.getState().settings.refresh,
                    stopOnTerminate: false
                });
            }
        }
    }
})

loadStore();
export default store;
