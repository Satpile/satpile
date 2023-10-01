import * as React from "react";
import { useEffect } from "react";
import { Switch, View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import { useTheme } from "../utils/Theme";
import { SettingsData } from "@taccolaa/react-native-settings-screen"; //https://github.com/jsoendermann/react-native-settings-screen
import { i18n } from "../translations/i18n";
import { MainTitle } from "../components/DynamicTitle";
import { durationToText, explorerToName, useSettings } from "../utils/Settings";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import * as StoreReview from "expo-store-review";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import {
  BLOG_URL,
  BUY_URL,
  COMPANY,
  FEEDBACK_URL,
  SHOP_URL,
  TWITTER_URL,
} from "../utils/Constants";
import { CustomSettingsScreen } from "../components/CustomSettingsScreen";
import { convertSatoshiToString } from "../utils/Helper";
import { useNavigation } from "@react-navigation/native";
import { ExplorerApi } from "../utils/Types";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [settings, updateSettings] = useSettings();

  const theme = useTheme();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <MainTitle title={i18n.t("settings.title")} />,
      headerLeft: () => (
        <Appbar.BackAction
          color={"white"}
          onPress={() => navigation.goBack()}
        />
      ),
    });
  }, [i18n, navigation]);

  const settingsData: SettingsData = [
    {
      type: "SECTION",
      rows: [
        {
          title: i18n.t("settings.refresh_every"),
          showDisclosureIndicator: true,
          renderAccessory: () => (
            <SettingItemValue type={"refresh"} value={settings.refresh} />
          ),
          onPress: () =>
            navigation.navigate("SettingsEdit", {
              setting: "refresh",
              title: i18n.t("settings.refresh"),
            }),
        },
        {
          title: i18n.t("settings.explorer.title"),
          showDisclosureIndicator: true,
          renderAccessory: () => (
            <SettingItemValue type={"explorer"} value={settings.explorer} />
          ),
          onPress: () =>
            navigation.navigate("SettingsEdit", {
              setting: "explorer",
              title: i18n.t("settings.explorer.title"),
            }),
        },
      ],
    },
    {
      type: "SECTION",
      rows: [
        {
          title: i18n.t("settings.locale"),
          showDisclosureIndicator: true,
          renderAccessory: () => (
            <SettingItemValue value={i18n.t("current_language")} />
          ),
          onPress: () =>
            navigation.navigate("SettingsEdit", {
              setting: "locale",
              title: i18n.t("settings.locale"),
            }),
        },
        {
          title: i18n.t("settings.dark_mode"),
          renderAccessory: () => (
            <Switch
              value={settings.darkMode}
              onValueChange={(value) => {
                updateSettings({ darkMode: value });
              }}
            />
          ),
        },
        {
          title: i18n.t("settings.hide_empty"),
          renderAccessory: () => (
            <Switch
              value={settings.hideEmptyAddresses}
              onValueChange={(value) => {
                updateSettings({ hideEmptyAddresses: value });
              }}
            />
          ),
        },
        {
          title: i18n.t("settings.display_unit_btc_sats"),
          renderAccessory: () => (
            <Switch
              value={settings.displayUnit === "bitcoin"}
              onValueChange={(value) => {
                updateSettings({ displayUnit: value ? "bitcoin" : "sats" });
              }}
            />
          ),
          subtitle: `${convertSatoshiToString(
            123456789,
            false,
            settings.displayUnit
          )} ${settings.displayUnit === "sats" ? "sats" : "₿"}`,
          subtitleStyle: {
            opacity: 0.5,
          },
        },
        {
          title: i18n.t("settings.icloud"),
          renderAccessory: () => (
            <Switch value={false} disabled={true} onValueChange={() => {}} />
          ),
        },
        {
          title: i18n.t("settings.security.title"),
          showDisclosureIndicator: true,
          onPress: () =>
            navigation.navigate("SettingsEdit", {
              setting: "lock",
              title: i18n.t("settings.security.title"),
            }),
        },
      ],
    },
    {
      type: "SECTION",
      rows: [
        {
          title: i18n.t("settings.buy"),
          renderBeforeAccessory: () => (
            <ItemIcon
              iconComponent={FontAwesome}
              icon={"bitcoin"}
              color={theme.colors.primary}
            />
          ),
          onPress: () => Linking.openURL(BUY_URL),
        },
        {
          title: i18n.t("settings.shop"),
          renderBeforeAccessory: () => (
            <ItemIcon icon={"md-cart"} color={"#5d2eb4"} />
          ),
          onPress: () => Linking.openURL(SHOP_URL),
        },
        {
          title: i18n.t("settings.feedback"),
          renderBeforeAccessory: () => (
            <ItemIcon icon={"md-mail"} color={"#74b42e"} />
          ),
          onPress: () =>
            WebBrowser.openBrowserAsync(
              FEEDBACK_URL.replace(
                "{version}",
                Constants.manifest?.version || "unknown"
              )
            ),
        },
        {
          title: i18n.t("settings.rate"),
          renderBeforeAccessory: () => (
            <ItemIcon icon={"md-heart"} color={"#cf021a"} />
          ),
          onPress: () => {
            let url = StoreReview.storeUrl();
            if (url) {
              Linking.openURL(url);
            } else {
              //TODO: fallback
            }
          },
        },
        {
          title: i18n.t("settings.twitter"),
          renderBeforeAccessory: () => (
            <ItemIcon icon={"logo-twitter"} color={"#53acee"} />
          ),
          onPress: () => Linking.openURL(TWITTER_URL),
        },
        {
          title: i18n.t("settings.website"),
          renderBeforeAccessory: () => (
            <ItemIcon icon={"md-globe"} color="#3b5998" />
          ),
          onPress: () => WebBrowser.openBrowserAsync(BLOG_URL),
        },
      ],
    },
    {
      type: "SECTION",

      rows: [
        {
          title: i18n.t("settings.about"),
          showDisclosureIndicator: true,
          onPress: () =>
            navigation.navigate("SettingsEdit", {
              setting: "about",
              title: i18n.t("settings.about"),
            }),
        },
        {
          title: i18n.t("settings.legal"),
          showDisclosureIndicator: true,
          onPress: () =>
            navigation.navigate("SettingsEdit", {
              setting: "legal",
              title: i18n.t("settings.legal"),
            }),
        },
        {
          title: i18n.t("settings.version"),
          renderAccessory: () => <Text>{Constants.manifest?.version}</Text>,
        },
        {
          title: i18n.t("settings.copyright"),
          renderAccessory: () => <Text>{COMPANY}</Text>,
        },
      ],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <CustomSettingsScreen settings={settingsData} />
    </View>
  );
}

const ItemIcon = ({
  icon,
  color,
  iconComponent,
}: {
  icon: string;
  color: string;
  iconComponent?: any;
}) => {
  const IconComponent = iconComponent || Ionicons;
  return (
    <View style={{ marginRight: 5 }}>
      <View
        style={{
          backgroundColor: color,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 5,
          width: 30,
          height: 30,
        }}
      >
        <IconComponent
          style={{
            alignContent: "center",
            marginBottom: 0,
          }}
          name={icon}
          color={"white"}
          size={20}
        />
      </View>
    </View>
  );
};

type SettingItemRefreshValue = {
  value: number;
  type: "refresh";
};

type SettingItemExplorerValue = {
  value: ExplorerApi;
  type: "explorer";
};

type SettingItemStringValue = {
  value: string;
  type?: null;
};

type SettingItemValueProps =
  | SettingItemRefreshValue
  | SettingItemExplorerValue
  | SettingItemStringValue;

const SettingItemValue = (props: SettingItemValueProps) => {
  const theme = useTheme();
  const style = { color: theme.settingsValue, marginRight: 6, fontSize: 18 };
  let displayedValue = props.value;
  switch (props.type) {
    case "refresh":
      displayedValue = durationToText(props.value);
      break;
    case "explorer":
      displayedValue = explorerToName(props.value);
      break;
  }
  return <Text style={style}>{displayedValue}</Text>;
};
