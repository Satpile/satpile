import { View } from "react-native";
import { Text } from "react-native-paper";
import React from "react";
import { INFORMATION_EMOJI, Tooltip } from "./Tooltip";

type Props = {
  text: string;
  info?: string;
};

export default ({ text, info = undefined }: Props) => {
  const content = (
    <Text
      style={{
        color: "#606060",
        textAlign: "center",
        fontSize: 20,
        lineHeight: 30,
        marginVertical: 2,
        letterSpacing: 0.15,
      }}
    >
      {text}
      {info && <> {INFORMATION_EMOJI}</>}
    </Text>
  );
  return (
    <View
      style={{
        alignContent: "center",
        flexDirection: "column",
        flex: 1,
        alignItems: "center",
        paddingHorizontal: "15%",
        paddingTop: 200,
      }}
    >
      {info ? <Tooltip text={info}>{content}</Tooltip> : content}
    </View>
  );
};
