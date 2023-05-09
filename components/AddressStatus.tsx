import { View } from "react-native";
import * as React from "react";
import { FontAwesome } from "@expo/vector-icons";

export enum AddressStatusType {
  NEW = "NEW", // Newly added wallet
  ERROR = "ERROR", // Error while fetching wallet balance
  OK = "OK", // Wallet balance is up to date
  OUTDATED = "OUTDATED", // Wallet balance hasn't been refreshed for a while. Not used yet
}

declare type AddressStatusIndicatorProps = { status: AddressStatusType };

export const AddressStatusIndicator = (props: AddressStatusIndicatorProps) => {
  return (
    <View
      style={{
        display: "flex",
        alignSelf: "center",
        width: 24,
        alignItems: "center",
      }}
    >
      {props.status === AddressStatusType.ERROR ? (
        <FontAwesome
          name={"exclamation-triangle"}
          style={{
            color: iconColor(props.status),
          }}
        />
      ) : (
        <FontAwesome
          name={"circle"}
          style={{ color: iconColor(props.status) }}
        />
      )}
    </View>
  );
};

function iconColor(status: AddressStatusType) {
  return {
    [AddressStatusType.NEW]: "#616161",
    [AddressStatusType.OUTDATED]: "#FFC400",
    [AddressStatusType.OK]: "rgba(0,0,0,0)", //Don't show anything if there is no problem
    [AddressStatusType.ERROR]: "rgba(255,0,0,0.5)",
  }[status];
}
