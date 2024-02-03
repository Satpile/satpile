import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Appbar, Text, TextInput, Title } from "react-native-paper";
import { MainTitle } from "../components/DynamicTitle";
import { useTheme } from "../utils/Theme";
import { useI18n } from "../utils/Settings";
import { ActionButton } from "../components/ActionButton";
import { verifyMessage } from "../utils/Signing";
import { BannerAlert } from "../components/BannerAlert";

type ParamsList = {
  MessageVerify?: {
    address?: string;
  };
};

export function MessageVerifyScreen() {
  const { params = {} } = useRoute<RouteProp<ParamsList, "MessageVerify">>();
  const navigation = useNavigation();
  const { t } = useI18n();
  const theme = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <MainTitle title={t("tools.signing.verify")} icon={"checkmark"} />
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
  }, [navigation]);

  const [status, setStatus] = React.useState<"idle" | "valid" | "invalid">(
    "idle"
  );

  const [address, setAddress] = React.useState(params.address ?? "");
  const [message, setMessage] = React.useState("");
  const [signature, setSignature] = React.useState("");

  const onChangeText =
    (field: "address" | "message" | "signature") => (text: string) => {
      switch (field) {
        case "address":
          setAddress(text);
          break;
        case "message":
          setMessage(text);
          break;
        case "signature":
          setSignature(text);
          break;
      }
      setStatus("idle");
    };

  return (
    <ScrollView
      style={{
        height: "100%",
        backgroundColor: theme.colors.background,
      }}
    >
      <View style={{ padding: 20, flexDirection: "column", gap: 16 }}>
        <Title>{t("tools.signing.verify_message")}</Title>
        <TextInput
          value={address}
          onChangeText={onChangeText("address")}
          editable={true}
          disabled={false}
          mode={"outlined"}
          label={t("signing.address")}
        />
        <TextInput
          value={message}
          scrollEnabled={true}
          multiline={true}
          numberOfLines={8}
          label={t("signing.message")}
          mode={"outlined"}
          style={{ minHeight: 200 }}
          onChangeText={onChangeText("message")}
        />
        <TextInput
          editable={true}
          multiline={true}
          numberOfLines={8}
          label={t("signing.signature")}
          mode={"outlined"}
          style={{ minHeight: 200 }}
          value={signature}
          onChangeText={onChangeText("signature")}
        />
        <View
          style={{
            alignItems: "center",
          }}
        >
          <ActionButton
            text={t("tools.signing.verify")}
            onPress={async () => {
              const result = await verifyMessage({
                message,
                address,
                signature,
              }).catch((err) => {
                console.error(err);
                return false;
              });
              setStatus(result ? "valid" : "invalid");
            }}
          />
        </View>
        {status !== "idle" && (
          <BannerAlert level={status === "valid" ? "success" : "error"}>
            <Text
              style={{
                color: theme.colors.background,
              }}
            >
              {status === "valid"
                ? t("tools.signing.valid_signature")
                : t("tools.signing.invalid_signature")}
            </Text>
          </BannerAlert>
        )}
      </View>
    </ScrollView>
  );
}
