import { Text, View } from "react-native";
import React, { useEffect } from "react";

import * as SplashScreen from "expo-splash-screen";
export const LoadingScreen = ({
  startAsync,
  onFinish,
}: {
  startAsync: () => Promise<void>;
  onFinish: () => Promise<void>;
}) => {
  useEffect(() => {
    startAsync().then(() => {
      SplashScreen.hideAsync().then(onFinish).catch(onFinish);
    });
  }, []);
  return <View style={{ flex: 1 }}></View>;
};
