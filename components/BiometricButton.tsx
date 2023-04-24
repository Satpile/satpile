import { Image, TouchableOpacity } from "react-native";
import React, { useMemo } from "react";
import { useTheme } from "../utils/Theme";
import { AuthenticationType } from "expo-local-authentication";

type Props = {
  onPress(): void;
  type: AuthenticationType;
};

export function BiometricButton({ onPress, type }: Props) {
  const imageFromAuthType = useMemo(() => {
    switch (type) {
      case AuthenticationType.FACIAL_RECOGNITION:
        return require("../assets/face-id.png");
      case AuthenticationType.FINGERPRINT:
        return require("../assets/touch-id.png");
      default:
        return undefined;
    }
  }, [type]);

  const theme = useTheme();

  return imageFromAuthType ? (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.4}
      style={{
        width: 40,
        height: 40,
        padding: 3,
        marginHorizontal: 15,
      }}
    >
      <Image
        source={imageFromAuthType}
        style={{
          height: "100%",
          width: "100%",
          tintColor: theme.colors.primary,
        }}
      />
    </TouchableOpacity>
  ) : null;
}
