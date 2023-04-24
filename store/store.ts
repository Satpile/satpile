import { createStore, Dispatch } from "redux";
import rootReducer from "./reducers";
import * as Actions from "./actions";
import AddressesStorage from "../utils/AddressesStorage";
import { updateLocale } from "../translations/i18n";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { createSelectorHook, useDispatch } from "react-redux";
import { Action } from "./actions/actions";
import { REFRESH_TASK } from "../utils/Types";

const store = createStore(rootReducer);
let storeLoaded = false;
export type RootState = ReturnType<typeof store.getState>;
export const useTypedSelector = createSelectorHook<RootState>();
export const useTypedDispatch = () => useDispatch<Dispatch<Action>>();
export async function loadStore() {
  if (!storeLoaded) {
    storeLoaded = true;
    store.dispatch(await Actions.loadData());
  }
}

store.subscribe(async () => {
  // fixes state reset due to race condition
  if (Object.keys(store.getState()).length === 0) {
    //if current state is empty
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
        if (
          TaskManager.isTaskDefined(REFRESH_TASK) &&
          (await TaskManager.isTaskRegisteredAsync(REFRESH_TASK))
        ) {
          BackgroundFetch.unregisterTaskAsync(REFRESH_TASK).catch((err) =>
            console.log("STORE", "err", err)
          );
        }
      } else {
        BackgroundFetch.registerTaskAsync(REFRESH_TASK, {
          minimumInterval: Math.max(store.getState().settings.refresh, 15 * 60),
          stopOnTerminate: false,
          startOnBoot: true,
        });
      }
    }
  }
});

loadStore();
export default store;
