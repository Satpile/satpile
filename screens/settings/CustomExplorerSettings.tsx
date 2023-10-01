import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  View,
} from "react-native";
import { Button, Switch, Text, TextInput } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { useI18n, useSettings } from "../../utils/Settings";
import { useTheme } from "../../utils/Theme";
import { Electrum } from "../../utils/explorers/Electrum";
import { Toast } from "../../components/Toast";
import { FontAwesome } from "@expo/vector-icons";

const transition = () => {
  if (Platform.OS === "ios") {
    LayoutAnimation.configureNext({
      duration: 100,
      create: {
        property: LayoutAnimation.Properties.opacity,
      },
      delete: {
        property: LayoutAnimation.Properties.opacity,
      },
    });
  }
};
export default function CustomExplorerSettings() {
  useEffect(() => {
    transition();
    return transition;
  }, []);
  const [settings, updateSettings] = useSettings();
  const theme = useTheme();
  const i18n = useI18n();
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  type ExplorerOption = NonNullable<typeof settings.explorerOption>;

  const updateExplorerOptions = (
    options: Partial<ExplorerOption["options"]>
  ) => {
    updateSettings({
      explorerOption: {
        ...settings.explorerOption,
        options: {
          ...(settings.explorerOption?.options ?? {
            host: "",
            port: 0,
            protocol: "tls",
          }),
          ...options,
        },
        type: "electrum",
      },
    });
  };

  return (
    <View
      style={{
        padding: 8,
        marginHorizontal: 4,
        borderWidth: 2,
        borderRadius: 12,
        borderColor: theme.colors.onSurface,
      }}
    >
      <TextInput
        disabled={testing}
        label={i18n.t("settings.explorer.hostname")}
        defaultValue={settings.explorerOption?.options.host}
        onChangeText={(text) => updateExplorerOptions({ host: text })}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 12,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            justifyContent: "space-around",
          }}
        >
          <Text>Enable TLS/SSL</Text>
          <Switch
            disabled={testing}
            value={settings.explorerOption?.options.protocol === "tls"}
            onValueChange={(value) => {
              updateExplorerOptions({ protocol: value ? "tls" : "tcp" });
            }}
            color={theme.colors.primary}
          />
        </View>
        <TextInput
          disabled={testing}
          style={{ flex: 1 }}
          label={i18n.t("settings.explorer.port_number")}
          defaultValue={(
            settings.explorerOption?.options.port ?? ""
          ).toString()}
          keyboardType={"number-pad"}
          error={settings.explorerOption?.options.port === 0}
          onChangeText={(text) => {
            const port = Math.min(65535, parseInt(text) || 0);
            updateExplorerOptions({ port });
          }}
        />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Button
          color={theme.colors.accent}
          disabled={testing}
          onPress={async () => {
            setTesting(true);
            setSuccess(false);
            setError(false);
            if (!settings.explorerOption) {
              return;
            }
            const electrum = new Electrum(settings.explorerOption.options);
            try {
              const client = await electrum.connect();
              Toast.showToast({
                message: i18n.t("connection_success"),
                duration: 2000,
                type: "top",
              });
              client.close();
              setSuccess(true);
            } catch (e) {
              setError(true);
            } finally {
              setTesting(false);
            }
          }}
        >
          {i18n.t("settings.explorer.test")}
        </Button>
        {error && (
          <FontAwesome
            name={"times-circle"}
            size={24}
            color={theme.colors.error}
          />
        )}
        {success && (
          <FontAwesome
            name={"check-circle"}
            size={24}
            color={theme.colors.success}
          />
        )}
        {testing && <ActivityIndicator size="small" />}
      </View>
    </View>
  );
}
