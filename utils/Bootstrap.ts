import {Platform, UIManager} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as TaskManager from "expo-task-manager";
import {REFRESH_TASK} from "./Settings";
import BalanceFetcher from "./BalanceFetcher";
import {Notifications} from "./Notifications";

export async function bootstrap() {
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  await SplashScreen.preventAutoHideAsync();
  if(!TaskManager.isTaskDefined(REFRESH_TASK)){
    TaskManager.defineTask(REFRESH_TASK, BalanceFetcher.backgroundFetch);
  }
  await Notifications.initNotifications();
}
