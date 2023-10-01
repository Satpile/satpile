import React from "react";
import { convertSatoshiToString } from "../utils/Helper";
import { Text } from "react-native-paper";
import { useSettings } from "../utils/Settings";
import { StyleProp, TextStyle } from "react-native";

export default function SatoshiText({
  amount,
  style = {},
  ...props
}: {
  amount: number | null;
  style?: StyleProp<TextStyle>;
} & React.ComponentProps<typeof Text>) {
  const [settings] = useSettings();
  let currency =
    settings.displayUnit === "sats"
      ? typeof amount === "number" && amount > 1
        ? "sats"
        : "sat"
      : "₿";

  return (
    <Text style={style} {...props}>
      {amount === null
        ? "---,---,---"
        : convertSatoshiToString(amount, false, settings.displayUnit)}{" "}
      {currency}
    </Text>
  );
}
