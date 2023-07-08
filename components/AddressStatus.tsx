import { View } from "react-native";
import * as React from "react";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

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
        <FontAwesome5
          name={"hourglass-half"}
          style={{
            color: addressStatusColor(props.status),
          }}
        />
      ) : (
        <FontAwesome
          name={"circle"}
          style={{ color: addressStatusColor(props.status) }}
        />
      )}
    </View>
  );
};

export function addressStatusColor(status: AddressStatusType) {
  return {
    [AddressStatusType.NEW]: "#616161",
    [AddressStatusType.OUTDATED]: "#FFC400",
    [AddressStatusType.OK]: "rgba(0,0,0,0)", //Don't show anything if there is no problem
    [AddressStatusType.ERROR]: "#FFC400",
  }[status];
}
