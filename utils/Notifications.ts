import {ActionType, Channel} from "expo/build/Notifications/Notifications.types";
import {Notifications as NotificationsManager} from 'expo';
import {AddressesBalanceDifference, Folder, FolderAddress} from "./Types";
import {AppState, Platform} from "react-native";
import {i18n} from "../translations/i18n";
import {convertSatoshiToString, truncate} from "./Helper";
import store from "../store/store";


export const BALANCE_UPDATE = "BALANCE_UPDATE";

declare type NotificationsCategory = {
    name: string,
    actions: ActionType[],
    placeholder: string
}

declare type NotificationsChannel = {
    id: string,
    channel: Channel
}

export class Notifications {

    static notificationCategories: NotificationsCategory[] = [
     {
            name: BALANCE_UPDATE,
            actions: [],
            placeholder: "Balances updates"
      }
    ];

    static channels: NotificationsChannel[] = [
        {
            id: BALANCE_UPDATE,
            channel: {
                name: "Balance update",
                sound: true,
                vibrate: true,
                description: "Notifies when a wallet's value changes",
                badge: true,
            }
        }
    ]

    static async initNotifications() {
        await Promise.all([
          ...this.notificationCategories.map(category => NotificationsManager.createCategoryAsync(category.name, category.actions, category.placeholder)),
          ...(Platform.OS === "android" ? this.channels.map(channel => NotificationsManager.createChannelAndroidAsync(channel.id, channel.channel)) : [])
        ]);
    }


    static findFolderAndAddressFromAddress(address: string): {address:FolderAddress, folder:Folder, folderIndex: number} {
        let folder: Folder = null;
        let folderAddress: FolderAddress = null;
        let folderIndex = -1; //If the folder has no name we use
        store.getState().folders.forEach((folderObj: Folder, i) => {
            if(folder) return; //skip if we found something

            folderObj.addresses.forEach((addressObj: FolderAddress) => {
                if(folderAddress) return; //skip if we found something

                if(addressObj.address === address){
                    folder = folderObj;
                    folderAddress = addressObj;
                    folderIndex = i;
                }
            })
        })

        return {folder, address:folderAddress, folderIndex};
    }

    static async sendSingleUpdateNotification(diff: AddressesBalanceDifference){
        if(AppState.currentState === "active"){ return; }

        const {folder, address, folderIndex} = this.findFolderAndAddressFromAddress(diff.address);
        console.log({folder, address, folderIndex});
        if(folderIndex === -1){
            return;
        }

        const netDiff = diff.after.balance-diff.before.balance;
        const netDiffString = convertSatoshiToString(netDiff, true) + " sats";

        const newTotal = diff.after.balance;
        const newTotalString = convertSatoshiToString(newTotal) + " sats";

        const direction = netDiff > 0 ? "increase" : "decrease";
        const ARROW_UP = "\u2b06\ufe0f";
        const ARROW_DOWN = "\u2b07\ufe0f";
        const ARROW = netDiff > 0 ? ARROW_UP : ARROW_DOWN;

        const title = `${i18n.t(`notification.${direction}.title`)} ${ARROW}`;

        let addressName = truncate(address.name, 16);
        if(addressName === ""){
            addressName = truncate(address.address, 16);
        }

        let folderName = truncate(folder.name, 16);
        if(folderName === ""){
            folderName = `#${folderIndex}`;
        }

        const lines = [
          addressName,
          `${i18n.t(`notification.folder`, {folder:folderName})}`,
          `${i18n.t(`notification.${direction}.diff`, {amount:netDiffString})}`,
          `${i18n.t(`notification.total`, {total:newTotalString})}`,
        ];

        await NotificationsManager.presentLocalNotificationAsync({
            title: title,
            body: lines.join("\n"),
            android:{
                channelId: BALANCE_UPDATE,
                color: "rgb(255,88,0)"
            },
            categoryId: BALANCE_UPDATE
        });


    }

    static async sendUpdateNotification(diffs: AddressesBalanceDifference[]){
        for(const diff of diffs){
            await this.sendSingleUpdateNotification(diff);
        }

    }

}
