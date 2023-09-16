import React from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { Headline, Subheading, Text, useTheme } from "react-native-paper";
import { i18n } from "../translations/i18n";
import Explorers from "../utils/explorers/Explorers";
import * as WebBrowser from "expo-web-browser";

export default function ExplorerList({ address }) {
  const theme = useTheme();
  return (
    <View style={{ paddingLeft: 50, display: "flex", flex: 1 }}>
      <Headline
        style={{
          textTransform: "uppercase",
          fontSize: 19,
          fontWeight: "bold",
          marginVertical: 0,
        }}
      >
        {i18n.t("dont_trust_verify")}
      </Headline>
      <Subheading
        style={{
          color: theme.colors.disabled,
          marginVertical: 0,
          fontSize: 14,
        }}
      >
        {i18n.t("links_will_open")}
      </Subheading>

      <ScrollView bounces={false}>
        <View style={{ paddingTop: 10 }}>
          {Explorers.filter((explorer) => "pattern" in explorer).map(
            (explorer) => (
              <Explorer
                key={explorer.name}
                explorer={explorer}
                address={address}
              />
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function Explorer({ explorer, address }) {
  const onClick = () => {
    WebBrowser.openBrowserAsync(generateURL());
  };

  const generateURL = () => {
    return explorer.pattern.replace("{address}", address);
  };

  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onClick}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 4,
        }}
      >
        <Image
          source={explorer.icon || require("../assets/icon.png")}
          style={{
            width: 24,
            height: 24,
            borderRadius: 3,
            backgroundColor: "white",
          }}
        />
        <Text style={{ marginLeft: 6 }}>{explorer.name}</Text>
      </View>
    </TouchableOpacity>
  );
}
