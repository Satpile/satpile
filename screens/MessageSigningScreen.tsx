import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useTypedSelector } from "../store/store";
import React, { useEffect } from "react";
import { Clipboard, ScrollView, View } from "react-native";
import { Appbar, TextInput, Title } from "react-native-paper";
import { MainTitle } from "../components/DynamicTitle";
import { useTheme } from "../utils/Theme";
import { useI18n } from "../utils/Settings";
import { ActionButton } from "../components/ActionButton";
import { Toast } from "../components/Toast";
import { i18n } from "../translations/i18n";
import { signMessage } from "../utils/Signing";

type ParamsList = {
  MessageSigning: {
    folderId: string;
    folderAddress: string;
  };
};

export function MessageSigningScreen() {
  const { params } = useRoute<RouteProp<ParamsList, "MessageSigning">>();
  const navigation = useNavigation();
  const { t } = useI18n();
  const data = useTypedSelector((state) => {
    const folder = state.folders.find(
      (folder) => folder.uid === params.folderId
    );
    if (!folder) {
      return null;
    }
    const address = folder.addresses.find(
      (address) => address.address === params.folderAddress
    );
    if (!address) {
      return null;
    }
    return {
      folder,
      address,
    };
  });

  useEffect(() => {
    if (!data || !data.folder.seed) {
      navigation.goBack();
      return;
    }
    navigation.setOptions({
      headerTitle: () => (
        <MainTitle title={data.folder.name} icon={"md-wallet"} />
      ),
      headerLeft: () => (
        <Appbar.BackAction
          color={"white"}
          onPress={() => navigation.goBack()}
        />
      ),
      headerTitleContainerStyle: {
        width: "100%",
        paddingHorizontal: 80,
      },
    });
  }, [data, navigation]);
  const theme = useTheme();

  const [message, setMessage] = React.useState("");
  const [signature, setSignature] = React.useState("");

  if (
    !data ||
    !data.folder.seed ||
    !data.address ||
    !data.address.derivationPath
  ) {
    return null;
  }

  const privateKeyDerivationInfos = {
    seed: data.folder.seed,
    passphrase: data.folder.seedPassphrase,
    derivationPath: data.address.derivationPath,
  };

  return (
    <ScrollView
      style={{
        height: "100%",
        backgroundColor: theme.colors.background,
      }}
    >
      <View style={{ padding: 20, flexDirection: "column", gap: 16 }}>
        <Title>{t("signing.title")}</Title>
        <TextInput
          value={data.address.address}
          editable={false}
          disabled={true}
          mode={"outlined"}
          label={t("signing.address")}
        />
        <TextInput
          scrollEnabled={true}
          multiline={true}
          numberOfLines={8}
          label={t("signing.message")}
          mode={"outlined"}
          style={{ minHeight: 200 }}
          onChangeText={(text) => setMessage(text)}
        />

        <View
          style={{
            alignItems: "center",
          }}
        >
          <ActionButton
            text={t("signing.sign")}
            onPress={async () => {
              const signature = await signMessage(
                message,
                privateKeyDerivationInfos
              );
              setSignature(signature);
            }}
          />
        </View>

        <TextInput
          editable={false}
          multiline={true}
          numberOfLines={8}
          label={t("signing.signature")}
          mode={"outlined"}
          style={{ minHeight: 200 }}
          value={signature}
        />
        <View
          style={{
            alignItems: "center",
          }}
        >
          <ActionButton
            text={t("copy")}
            onPress={() => {
              Clipboard.setString(signature);
              Toast.showToast({
                duration: 1500,
                message: i18n.t("signing.copied"),
                type: "top",
              });
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
