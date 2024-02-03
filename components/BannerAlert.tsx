import { View } from "react-native";
import { useTheme } from "../utils/Theme";
import React from "react";

export const BannerAlert = ({
  level,
  children,
}: {
  level: "error" | "success";
  children: React.ReactNode;
}) => {
  const theme = useTheme();
  return (
    <View
      style={{
        padding: 20,
        flexDirection: "column",
        backgroundColor:
          level === "error" ? theme.colors.error : theme.colors.success,
        borderRadius: 8,
      }}
    >
      {children}
    </View>
  );
};
