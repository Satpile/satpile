import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BalanceFetcher from "../utils/BalanceFetcher";
import { i18n } from "../translations/i18n";
import { useSettings } from "../utils/Settings";
import { useTypedSelector } from "../store/store";
import { AddressStatusType } from "./AddressStatus";

export default function ReloadButton() {
  const { lastReloadTime, folders, loading, hasError } = useTypedSelector(
    (state) => ({
      lastReloadTime: state.lastReloadTime,
      folders: state.folders,
      loading: state.loading,
      hasError: Object.entries(state.addresses).some(
        ([key, value]) => value.status === AddressStatusType.ERROR
      ),
    })
  );

  //Call useSettings hook to refresh text when settings change
  //Should not be needed if we used a useTranslation hook but would require some work
  const [settings, updateSettings] = useSettings();

  if (folders.length === 0) return null;

  return (
    <View
      style={{
        padding: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          requestAnimationFrame(() => BalanceFetcher.filterAndFetchBalances());
        }}
      >
        <View
          style={{
            display: "flex",
            padding: 10,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#717171" }}>
            {lastReloadTime === ""
              ? i18n.t("tap_reload")
              : i18n.t("last_update") +
                " " +
                i18n.l("date.formats.long", new Date(lastReloadTime))}
          </Text>
          <Ionicons
            style={{ paddingTop: 1, paddingLeft: 3 }}
            name={hasError ? "warning" : "md-refresh-circle"}
            color={"gray"}
            size={20}
          />
          {loading && (
            <ActivityIndicator
              style={{ paddingLeft: 5 }}
              size={"small"}
              color={"gray"}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
