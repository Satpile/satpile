import { View } from "react-native";
import React, { useEffect } from "react";
import { MainTitle } from "../components/DynamicTitle";
import { Appbar, useTheme } from "react-native-paper";
import { useI18n, useLockState } from "../utils/Settings";
import { useNavigation } from "@react-navigation/native";
import { CustomSettingsScreen } from "../components/CustomSettingsScreen";

export default function ToolsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const i18n = useI18n();
  const lockState = useLockState();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <MainTitle title={i18n.t("tools.title")} />,
      headerLeft: () => (
        <Appbar.BackAction
          color={"white"}
          onPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation, lockState]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <CustomSettingsScreen
        settings={[
          {
            type: "SECTION",
            header: i18n.t("tools.signing.title"),
            rows: [
              {
                title: i18n.t("tools.signing.verify_message"),
                showDisclosureIndicator: true,
                onPress: () => navigation.navigate("MessageVerify"),
              },
            ],
          },
        ]}
      />
    </View>
  );
}
