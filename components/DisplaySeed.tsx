import { StyleSheet, View } from "react-native";
import { useState } from "react";
import { Button, Text } from "react-native-paper";

export function DisplaySeed({ seed }: { seed: string }) {
  const [showSeed, setShowSeed] = useState(false);
  // show a button to show the seed
  return (
    <View style={style.container}>
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
    // textAlign: "center",
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
