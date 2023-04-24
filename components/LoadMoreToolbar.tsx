import React from "react";
import { Button } from "react-native-paper";
import { useTheme } from "../utils/Theme";
import { Toolbar } from "./Toolbar";
import { ActivityIndicator } from "react-native";
import { i18n } from "../translations/i18n";

interface LoadMoreToolbarProps {
  display: boolean;
  onLoadMore(): void;
  loading: boolean;
}
export function LoadMoreToolbar({
  display,
  onLoadMore,
  loading,
}: LoadMoreToolbarProps) {
  const theme = useTheme();
  return (
    <Toolbar display={display}>
      {loading && <ActivityIndicator size="small" />}
      <Button
        color={theme.colors.onSurface}
        disabled={loading}
        onPress={onLoadMore}
      >
        {i18n.t("generate_new_addresses")}
      </Button>
    </Toolbar>
  );
}
