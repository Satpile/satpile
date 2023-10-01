import { Tooltip as TooltipRNE } from "react-native-elements";
import React, { useState } from "react";
import { Text } from "react-native-paper";
import { useTheme } from "../utils/Theme";

type Props = {
  text: string;
  children?: React.ReactNode;
};

export const INFORMATION_EMOJI = "\u2139\uFE0F";
export const Tooltip = ({ text, children }: Props) => {
  const theme = useTheme();
  const [width, setWitdh] = useState<number>();
  const [height, setHeight] = useState<number>();
  return (
    // @ts-ignore - react-native-elements is not typed correctly, the children prop is missing
    <TooltipRNE
      popover={
        <Text
          style={{
            color: theme.colors.primary,
          }}
          onLayout={({ nativeEvent }) => {
            if (!width || !height) {
              setWitdh(nativeEvent.layout.width * 1.5);
              setHeight(nativeEvent.layout.height * 1.5);
            }
          }}
          textBreakStrategy={"balanced"}
        >
          {text}
        </Text>
      }
      backgroundColor={theme.colors.onSurface}
      overlayColor={"transparent"}
      containerStyle={{
        borderRadius: 0,
      }}
      height={height || 500}
      width={width || 200}
    >
      {children}
    </TooltipRNE>
  );
};
