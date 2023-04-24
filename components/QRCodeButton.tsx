import { TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { i18n } from "../translations/i18n";
import { Text, useTheme } from "react-native-paper";

export default function QRCodeButton({ onPress }) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={{
        height: 54,
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
        alignSelf: "center",
      }}
    >
      <AntDesign
        size={34}
        name={"qrcode"}
        style={{ color: theme.colors.text }}
      />
      <Text> {i18n.t("scan_qr_code")}</Text>
    </TouchableOpacity>
  );
}
