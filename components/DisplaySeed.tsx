import { StyleSheet, View } from "react-native";
import { useMemo, useState } from "react";
import { Button, Text, Title } from "react-native-paper";
import { i18n } from "../translations/i18n";
import QRCode from "react-native-qrcode-svg";
import { generateSeedQRDataFromMnemonic } from "../utils/Seed";
import { useI18n } from "../utils/Settings";

export function DisplaySeed({ seed }: { seed: string }) {
  const [showSeed, setShowSeed] = useState(false);
  const seedQr = useMemo(() => {
    return generateSeedQRDataFromMnemonic(seed);
  }, [seed]);
  const { t } = useI18n();
  return (
    <View style={style.container}>
      <Title>Seed</Title>
      <Text>{i18n.t("seed_warning")}</Text>
      <Button
        color={"red"}
        mode="outlined"
        onPress={() => {
          setShowSeed((showSeed) => !showSeed);
        }}
      >
        {t(showSeed ? "hide_seed" : "show_seed")}
      </Button>
      <View style={style.seedContainer}>
        {seed.split(" ").map((w, i) => (
          <Text key={i} style={style.text}>
            {`${i + 1}.`.padStart(3, " ") + ` ${showSeed ? w : "******"}`}
          </Text>
        ))}
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <Text>SeedQR</Text>
        <QRCode
          ecl={"L"}
          size={300}
          quietZone={10}
          color={"black"}
          backgroundColor={showSeed ? "white" : "black"}
          // @ts-ignore
          value={[
            {
              data: seedQr,
              mode: "numeric",
            },
          ]}
        />
      </View>
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
    paddingVertical: 18,
    gap: 20,
  },
});
