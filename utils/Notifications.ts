import {ActionType} from "expo/build/Notifications/Notifications.types";

export const BALANCE_UPDATE = "BALANCE_UPDATE";

declare type NotificationsCategory = {
    name: string,
    actions: ActionType[]
}

export class Notifications {

    static notificationCategories: NotificationsCategory[] = [
        {
            name: BALANCE_UPDATE,
            actions: [{
                actionId: "dismiss",
                buttonTitle: "Dismiss",
                isAuthenticationRequired: true,
                doNotOpenInForeground: false
            }]
        }
    ];

    static async initNotifications() {
        //await Promise.all(this.notificationCategories.map(category => NotificationsManager.createCategoryAsync(category.name, category.actions)));
    }

}
