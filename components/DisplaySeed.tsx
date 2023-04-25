import { StyleSheet, View } from "react-native";
import { useState } from "react";
import { Button, Text, Title } from "react-native-paper";
import { i18n } from "../translations/i18n";

export function DisplaySeed({ seed }: { seed: string }) {
  const [showSeed, setShowSeed] = useState(false);

  return (
    <View style={style.container}>
      <Title>Seed</Title>
      <Text style={{ marginBottom: 20 }}>{i18n.t("seed_warning")}</Text>
      <View style={style.seedContainer}>
        {seed.split(" ").map((w, i) => (
          <Text key={i} style={style.text}>
            {`${i + 1}.`.padEnd(4, " ") + `${showSeed ? w : "******"}`}
          </Text>
        ))}
      </View>
      <Button
        mode="outlined"
        onPress={() => {
          setShowSeed((showSeed) => !showSeed);
        }}
      >
        {showSeed ? "Hide Seed" : "Show Seed"}
      </Button>
    </View>
  );
}

const style = StyleSheet.create({
  text: {
    fontSize: 18,
    lineHeight: 30,
    width: "33%",
  },
  seedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingVertical: 18,
  },
});
