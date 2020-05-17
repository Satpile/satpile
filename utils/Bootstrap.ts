import {Platform, UIManager} from "react-native";
import {SplashScreen} from "expo";
import * as TaskManager from "expo-task-manager";
import {REFRESH_TASK} from "./Settings";
import BalanceFetcher from "./BalanceFetcher";
import {Notifications} from "./Notifications";

export function bootstrap() {
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  SplashScreen.preventAutoHide();
  if(!TaskManager.isTaskDefined(REFRESH_TASK)){
    TaskManager.defineTask(REFRESH_TASK, BalanceFetcher.backgroundFetch);
  }
  Notifications.initNotifications();
}
