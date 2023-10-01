import * as NotificationsManager from "expo-notifications";
import { AddressesBalanceDifference, Folder, FolderAddress } from "./Types";
import { AppState } from "react-native";
import { i18n } from "../translations/i18n";
import { convertSatoshiToString, truncate } from "./Helper";
import store from "../store/store";

export class Notifications {
  static async initNotifications() {
    NotificationsManager.setNotificationHandler({
      handleNotification: async () => {
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        };
      },
    });
  }

  static findFolderAndAddressFromAddress(address: string): {
    address: FolderAddress;
    folder: Folder;
    folderIndex: number;
  } | null {
    let result: {
      address: FolderAddress;
      folder: Folder;
      folderIndex: number;
    } | null = null;

    /* let folder: Folder | null = null;
    let folderAddress: FolderAddress | null = null;
    let folderIndex = -1; //If the folder has no name we use*/
    store.getState().folders.forEach((folderObj: Folder, i) => {
      if (result) return; //skip if we found something

      folderObj.addresses.forEach((addressObj: FolderAddress) => {
        if (result) return; //skip if we found something

        if (addressObj.address === address) {
          result = {
            folder: folderObj,
            address: addressObj,
            folderIndex: i,
          };
        }
      });
    });

    return result;
  }

  static async sendSingleUpdateNotification(diff: AddressesBalanceDifference) {
    if (AppState.currentState === "active") {
      return;
    }

    const result = this.findFolderAndAddressFromAddress(diff.address);

    if (!result) {
      return;
    }

    const { folder, address, folderIndex } = result;

    const netDiff = diff.after.balance - diff.before.balance;
    const netDiffString = convertSatoshiToString(netDiff, true) + " sats";

    const newTotal = diff.after.balance;
    const newTotalString = convertSatoshiToString(newTotal) + " sats";

    const direction = netDiff > 0 ? "increase" : "decrease";
    const ARROW_UP = "\u2b06\ufe0f";
    const ARROW_DOWN = "\u2b07\ufe0f";
    const ARROW = netDiff > 0 ? ARROW_UP : ARROW_DOWN;

    const title = `${i18n.t(`notification.${direction}.title`)} ${ARROW}`;

    let addressName = truncate(address.name, 16);
    if (addressName === "") {
      addressName = truncate(address.address, 16);
    }

    let folderName = truncate(folder.name, 16);
    if (folderName === "") {
      folderName = `#${folderIndex}`;
    }

    const lines = [
      addressName,
      `${i18n.t(`notification.folder`, { folder: folderName })}`,
      `${i18n.t(`notification.${direction}.diff`, { amount: netDiffString })}`,
      `${i18n.t(`notification.total`, { total: newTotalString })}`,
    ];

    return NotificationsManager.scheduleNotificationAsync({
      content: {
        title,
        body: lines.join("\n"),
      },
      trigger: null,
    });
  }

  static async sendUpdateNotification(diffs: AddressesBalanceDifference[]) {
    for (const diff of diffs) {
      await this.sendSingleUpdateNotification(diff);
    }
  }
}
