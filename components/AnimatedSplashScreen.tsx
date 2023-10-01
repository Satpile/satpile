import React, { useEffect, useState } from "react";
import { Animated, Easing, StatusBar, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

export default function AnimatedSplashScreen({
  onAnimationDone,
  animate,
}: {
  onAnimationDone: () => void;
  animate: boolean;
}) {
  const [bg] = useState(new Animated.Value(0));
  const [scale] = useState(new Animated.Value(0));
  const theme = useTheme();

  useEffect(() => {
    if (animate) {
      Animated.sequence([
        Animated.timing(bg, {
          toValue: 1,
          duration: 250,
          easing: Easing.cubic,
          useNativeDriver: false,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 250,
          easing: Easing.cubic,
          useNativeDriver: false,
        }),
      ]).start(() => setTimeout(onAnimationDone, 1));
    }
  }, [animate]);

  const targetBg = theme.dark ? "rgb(0,0,0)" : "rgb(255,255,255)";
  const whiteToBlack = bg.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgb(255,255,255)", targetBg],
  });

  return (
    <Animated.View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: whiteToBlack,
        zIndex: 5,
      }}
    >
      <StatusBar animated={true} backgroundColor={"rgba(0,0,0,0)"} />
      <Animated.Image
        style={{
          resizeMode: "contain",
          width: "100%",
          alignItems: "center",
          alignSelf: "center",
          flex: 1,
          backgroundColor: whiteToBlack,
          transform: [
            {
              scale: scale.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 15],
              }),
            },
            { perspective: 1000 },
          ],
          opacity: scale.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
        }}
        source={require("../assets/splash.png")}
      />
    </Animated.View>
  );
}
