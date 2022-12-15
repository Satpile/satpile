import {LogBox, Platform, UIManager} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as TaskManager from "expo-task-manager";
import {REFRESH_TASK} from "./Settings";
import BalanceFetcher from "./BalanceFetcher";
import {Notifications} from "./Notifications";
import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";

export async function bootstrap() {
    bitcoin.initEccLib(ecc);

    LogBox.ignoreLogs([
      "Cannot update a component from inside", //TODO: investigate what triggers this, (appears to be in react navigation)
      "Using Math.random is not cryptographically secure", //Already fixed but still triggers warning
      "Stopping Tor daemon."
  ]);

  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  await SplashScreen.preventAutoHideAsync().catch((e) => console.warn(e));
  if(!TaskManager.isTaskDefined(REFRESH_TASK)){
    TaskManager.defineTask(REFRESH_TASK, () => BalanceFetcher.backgroundFetch());
  }
  await Notifications.initNotifications();
}
