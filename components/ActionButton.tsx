import { Button, useTheme } from "react-native-paper";
import React from "react";

export const ActionButton = ({
  onPress,
  text,
  ...props
}: {
  onPress: () => void;
  text: string;
} & Omit<React.ComponentProps<typeof Button>, "children">) => {
  const theme = useTheme();
  props.color = props.color === "black" ? theme.colors.text : props.color;

  return (
    <Button
      contentStyle={{
        alignSelf: "flex-start",
        ...(!props.icon ? { paddingLeft: 5 } : {}),
      }}
      labelStyle={{
        marginVertical: 6,
      }}
      style={{
        marginVertical: 3,
      }}
      mode={"outlined"}
      compact={true}
      onPress={onPress}
      {...props}
    >
      {text}
    </Button>
  );
};
