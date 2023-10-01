import React, { useEffect, useState } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Image, StatusBar, StyleSheet, View } from "react-native";
import { Appbar, Subheading } from "react-native-paper";
import { i18n } from "../translations/i18n";
import { askPermission } from "../utils/Settings";
import { isAddressValid } from "../utils/Helper";
import { AddingEnum } from "../utils/Types";
import { generateMnemonicFromSeedQRData } from "../utils/Seed";

type BarCodeEventHandler = React.ComponentProps<
  typeof BarCodeScanner
>["onBarCodeScanned"];

type Props = {
  onAddressScanned: (address: string) => void;
  onCancel: () => void;
  scanningType: AddingEnum;
};

export function QRCodeScanner({
  onAddressScanned,
  onCancel,
  scanningType,
}: Props) {
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    getPermissionsAsync();
  }, []);

  const getPermissionsAsync = async () => {
    const result = await askPermission("camera", i18n.t("permission.camera"));
    if (!result) {
      onCancel();
    } else {
      setHasCameraPermission(result);
    }
  };

  const onScan: BarCodeEventHandler = (result) => {
    if (result.type === BarCodeScanner.Constants.BarCodeType.qr) {
      let address = result.data.replace("bitcoin:", "");

      if (scanningType === AddingEnum.XPUB_WALLET_WITH_SEED) {
        try {
          const seed = generateMnemonicFromSeedQRData(address);
          if (seed) {
            onAddressScanned(seed);
            return;
          }
        } catch (e) {
          console.log(e);
        }
      }

      if (isAddressValid(address, scanningType)) {
        onAddressScanned(address);
      }
    }
  };

  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        backgroundColor: "black",
      }}
    >
      <StatusBar backgroundColor={"#000000"} animated={false} />
      {hasCameraPermission && (
        <BarCodeScanner
          style={{ ...StyleSheet.absoluteFillObject, backgroundColor: "black" }}
          onBarCodeScanned={(v) => {
            onScan(v);
          }}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        />
      )}
      <Appbar.Header
        style={{
          paddingLeft: 10,
          paddingRight: 10,
          backgroundColor: "rgba(10,10,10,0.4)",
          paddingTop: 0,
        }}
      >
        <Subheading
          onPress={() => onCancel()}
          style={{ flex: 1, color: "white", textAlign: "left" }}
        >
          {i18n.t("cancel")}
        </Subheading>
      </Appbar.Header>
      <View
        style={{
          flex: 1,
          marginBottom: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ height: 300, width: 300 }}
          source={require("../assets/scanning.png")}
        />
      </View>
    </View>
  );
}
