import { MainTitle } from "../../components/DynamicTitle";
import { i18n, updateLocale } from "../../translations/i18n";
import { Appbar, Headline, Text, useTheme } from "react-native-paper";
import * as React from "react";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import {
  askPermission,
  defaultCustomElectrum,
  durationToText,
  useSettings,
} from "../../utils/Settings";
import { SettingsData } from "@taccolaa/react-native-settings-screen";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { TWITTER_URL } from "../../utils/Constants";
import { Legal } from "./Legal";
import { CustomSettingsScreen } from "../../components/CustomSettingsScreen";
import { LockSettingsScreen } from "./LockSettingsScreen";
import { ExplorerApi } from "../../utils/Types";
import CustomExplorerSettings from "./CustomExplorerSettings";
import explorers, { ExplorerWithApi } from "../../utils/explorers/Explorers";
import { useKeyBoardHeight } from "../../utils/Keyboard";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

type ParamsList = {
  SettingsEdit: {
    title: string;
    setting: string;
  };
};

// This component uses a fork of react-native-settings-screen to easily display the settings items.
export default function SettingsEditScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamsList, "SettingsEdit">>();
  const { setting, title } = route.params;
  const [settings, updateSettings] = useSettings();
  const theme = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <MainTitle title={title || i18n.t("settings.title")} />
      ),
      headerLeft: () => (
        <Appbar.BackAction
          color={"white"}
          onPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation, title, i18n]);

  const keyboardHeight = useKeyBoardHeight();

  let settingsData: SettingsData = [];

  switch (setting) {
    //Background refresh interval
    case "refresh":
      let refreshValues = [
        { value: -1 },
        { value: 60 * 15 },
        { value: 60 * 30 },
        { value: 60 * 45 },
        { value: 60 * 60 },
      ];

      settingsData = [
        {
          type: "SECTION",
          header: i18n.t("settings.refresh_every"),
          rows: refreshValues.map((value) => {
            return {
              title: durationToText(value.value),
              showDisclosureIndicator: false,
              renderAccessory: () => {
                if (settings.refresh === value.value) {
                  return (
                    <Ionicons name={"checkmark"} color={"#f47c1c"} size={20} />
                  );
                }
                return <></>;
              },
              onPress: async () => {
                if (
                  value.value === -1 ||
                  (await askPermission(
                    "notifications",
                    i18n.t("permission.notification")
                  ))
                ) {
                  updateSettings({ refresh: value.value });
                }
              },
            };
          }),
        },
      ];
      break;
    case "explorer":
      settingsData = [
        {
          type: "SECTION",
          header: i18n.t("settings.explorer.http_api"),
          rows: explorers
            .filter(
              (explorer): explorer is ExplorerWithApi =>
                "explorerApi" in explorer
            )
            .map((explorer) => ({
              title: explorer.name,
              showDisclosureIndicator: false,
              renderAccessory: () => {
                if (settings.explorer === explorer.explorerApi) {
                  return (
                    <Ionicons name={"checkmark"} color={"#f47c1c"} size={20} />
                  );
                }
                return <></>;
              },
              onPress: () => {
                updateSettings({ explorer: explorer.explorerApi });
              },
              subtitle: explorer.desc,
              renderBeforeAccessory: () => {
                return (
                  <Image
                    source={explorer.icon || require("../../assets/icon.png")}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 3,
                      backgroundColor: "white",
                      marginRight: 8,
                    }}
                  />
                );
              },
            })),
        },
        {
          type: "SECTION",
          header: i18n.t("settings.explorer.custom"),
          rows: [
            {
              title: i18n.t("settings.explorer.custom_electrum"),
              showDisclosureIndicator: false,
              renderAccessory: () => {
                if (settings.explorer === ExplorerApi.CUSTOM) {
                  return (
                    <Ionicons name={"checkmark"} color={"#f47c1c"} size={20} />
                  );
                }
                return <></>;
              },
              onPress: () => {
                if (settings.explorer !== ExplorerApi.CUSTOM) {
                  updateSettings({
                    explorer: ExplorerApi.CUSTOM,
                    explorerOption:
                      settings.explorerOption || defaultCustomElectrum(),
                  });
                }
              },
              renderBeforeAccessory: () => {
                return (
                  <Image
                    source={require("../../assets/explorers/electrum.png")}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 3,
                      backgroundColor: "white",
                      marginRight: 4,
                    }}
                  />
                );
              },
            },
          ],
        },
        {
          visible: settings.explorer === ExplorerApi.CUSTOM,
          type: "CUSTOM_VIEW",
          key: "settings.explorer_custom.options",
          render: () => {
            return <CustomExplorerSettings />;
          },
        },
      ];
      break;
    //Language setting
    case "locale":
      const languages = Object.keys(i18n.translations).map((locale) => {
        const localeName = (
          i18n.translations[locale] as { current_language: string }
        )["current_language"];

        return {
          title: localeName,
          showDisclosureIndicator: false,
          renderAccessory: () => {
            if (
              settings.locale === locale ||
              localeName === i18n.t("current_language")
            ) {
              return (
                <Ionicons name={"checkmark"} color={"#f47c1c"} size={20} />
              );
            }
            return <></>;
          },
          onPress: () => {
            updateLocale(locale);
            updateSettings({ locale: locale });
          },
        };
      });

      settingsData = [
        {
          type: "SECTION",
          header: i18n.t("settings.locale"),
          rows: languages,
        },
      ];
      break;
    case "about":
      settingsData = [
        {
          type: "CUSTOM_VIEW",
          render: () => {
            return (
              <View style={{ padding: 32 }}>
                <Headline>{i18n.t("settings.about")}</Headline>
                <Text style={styles.simpleText}>
                  {i18n.t("settings.about_content.0")}
                </Text>
                <Text style={styles.simpleText}>
                  {i18n.t("settings.about_content.1")}
                  {"\u00A0" /* &nbsp */}
                  <Text
                    style={{ color: "#f47c1c" }}
                    onPress={() => Linking.openURL(TWITTER_URL)}
                  >
                    @satpile
                  </Text>
                  .{"\n"}
                  {i18n.t("settings.about_content.2")}
                </Text>
                <Headline>{i18n.t("settings.about_thanks")}</Headline>
                <Text style={styles.simpleText}>
                  {i18n.t("settings.about_thanks_content")}
                </Text>
              </View>
            );
          },
        },
      ];
      break;
    case "legal":
      settingsData = [
        {
          type: "CUSTOM_VIEW",
          render: () => {
            return (
              <View style={{ padding: 32 }}>
                <Headline>{i18n.t("settings.legal")}</Headline>
                <Text selectable={true} style={styles.simpleText}>
                  <Legal />
                </Text>
              </View>
            );
          },
        },
      ];
      break;
    case "lock":
      return <LockSettingsScreen />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingBottom: keyboardHeight,
      }}
    >
      <CustomSettingsScreen settings={settingsData} />
    </View>
  );
}

const styles = StyleSheet.create({
  simpleText: {
    fontSize: 16,
    textAlign: "justify",
    marginVertical: 16,
    letterSpacing: -0.5,
  },
  simpleTextContainer: {
    padding: 32,
  },
});
