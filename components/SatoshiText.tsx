import React from "react";
import { convertSatoshiToString } from "../utils/Helper";
import { Text } from "react-native-paper";
import { useSettings } from "../utils/Settings";

export default function SatoshiText({ amount, style = {}, ...props }) {
  const [settings] = useSettings();
  let currency =
    settings.displayUnit === "sats" ? (amount > 1 ? "sats" : "sat") : "₿";
  return (
    <Text style={style} {...props}>
      {amount === null
        ? "---,---,---"
        : convertSatoshiToString(amount, false, settings.displayUnit)}{" "}
      {currency}
    </Text>
  );
}
