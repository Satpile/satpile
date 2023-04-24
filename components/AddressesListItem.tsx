import React from "react";
import {
  Clipboard,
  Image,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import { List, useTheme } from "react-native-paper";
import AddressesListItemValue from "./AddressesListItemValue";
import { Toast } from "./Toast";
import { i18n } from "../translations/i18n";

export default function AddressesListItem({ address, onClick }) {
  const theme = useTheme();

  const setClipBoard = () => {
    Clipboard.setString(address.address);
    Toast.showToast({
      message: i18n.t("address_copied"),
      duration: 1500,
      type: "bottom",
    });
  };

  return (
    <TouchableHighlight
      onLongPress={() => {
        setClipBoard();
      }}
      onPress={() => {
        onClick(address);
      }}
      style={{
        backgroundColor: theme.colors.surface,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.colors.background,
      }}
      underlayColor={theme.colors.background}
    >
      <View>
        <List.Item
          title={address.name}
          description={address.address}
          left={() => (
            <View style={{ alignContent: "flex-start" }}>
              <Image
                source={require("../assets/icon_small.png")}
                style={{
                  marginLeft: 5,
                  marginTop: 6,
                  paddingBottom: 0,
                  height: 24,
                  width: 24,
                }}
              />
            </View>
          )}
          style={{ marginBottom: 0, paddingBottom: 0 }}
          titleEllipsizeMode={"tail"}
          descriptionEllipsizeMode={"middle"}
          descriptionNumberOfLines={1}
          descriptionStyle={{
            marginTop: 2,
            paddingBottom: 0,
            paddingRight: 25,
          }}
          titleStyle={{ paddingRight: 25 }}
        />
        <AddressesListItemValue address={address} />
      </View>
    </TouchableHighlight>
  );
}
