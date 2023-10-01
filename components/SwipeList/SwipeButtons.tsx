import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useI18n } from "../../utils/Settings";
import { SwipeAction } from "./SwipeList";
import { useTheme } from "react-native-paper";
import { FAIconName } from "../../utils/Types";

declare type SwipeButtonsProps<T> = {
  onClose?: () => void;
  position: "right" | "left";
  actions: SwipeAction<T>[];
  showClose: boolean;
  width?: number;
  item: any;
};

export function SwipeButtons<T>(props: SwipeButtonsProps<T>) {
  const {
    onClose,
    position,
    actions,
    showClose = true,
    width,
    item,
  } = {
    width: 80,
    ...props,
  };
  const i18n = useI18n();
  const theme = useTheme();

  const closeButton = showClose && (
    <SwipeButton
      key={"close"}
      onClick={onClose}
      width={width}
      text={i18n.t("close")}
      icon={`chevron-${position}`}
      backgroundColor={"#444"}
    />
  );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: position === "right" ? "flex-end" : "flex-start",
        backgroundColor: actions[0] ? actions[0].backgroundColor : "#444",
        flexDirection: "row",
        borderLeftColor: theme.colors.background,
        borderLeftWidth: StyleSheet.hairlineWidth,
        alignSelf: position === "right" ? "flex-end" : "flex-start",
        width: Dimensions.get("screen").width - 5, //Fixes glitch on screen change
      }}
    >
      {position === "left" && closeButton}
      {actions.map((action) => (
        <SwipeButton
          key={action.text}
          onClick={() => action.onclick(item)}
          width={width}
          text={action.text}
          icon={action.icon}
          color={action.color}
          backgroundColor={action.backgroundColor}
        />
      ))}
      {position === "right" && closeButton}
    </View>
  );
}

function SwipeButton({
  onClick,
  width = 80,
  text,
  icon,
  color = "white",
  backgroundColor = "#444",
}: {
  onClick?: () => void;
  width?: number;
  text: string;
  icon: FAIconName;
  color?: string;
  backgroundColor?: string;
}) {
  return (
    <TouchableHighlight onPress={onClick} underlayColor={"#444"}>
      <View
        style={{
          width,
          backgroundColor,
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FontAwesome name={icon} size={24} color={color} />
        <Text style={{ color, marginTop: 5 }}>{text}</Text>
      </View>
    </TouchableHighlight>
  );
}
