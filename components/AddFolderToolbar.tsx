import React from "react";
import { Appbar, Text } from "react-native-paper";
import { useTheme } from "../utils/Theme";
import { Toolbar } from "./Toolbar";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableHighlight } from "react-native";

interface AddFolderToolbarProps {
  display: boolean;
  onHide(): void;
  onAddFolder(): void;
}
export function AddFolderToolbar({
  display,
  onHide,
  onAddFolder,
}: AddFolderToolbarProps) {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <Toolbar
      display={display}
      style={{
        alignItems: "flex-start",
        paddingTop: display ? 12 : 0,
      }}
    >
      <Appbar.Action
        style={{
          marginTop: 0,
        }}
        color={theme.colors.onSurface}
        icon="folder"
        onPress={() => {
          onHide();
          onAddFolder();
        }}
      />
      <TouchableHighlight
        style={{
          marginRight: 5,
          padding: 5,
          borderRadius: 17,
        }}
        onPress={() => {
          onHide();
          navigation.navigate("Add", { folder: null });
        }}
        underlayColor={
          theme.dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)"
        }
      >
        <>
          <MaterialCommunityIcons
            name={"wallet"}
            color={theme.colors.onSurface}
            size={24}
          />
          <Text
            style={{
              fontSize: 8,
              position: "absolute",
              bottom: -3,
              left: 5,
              width: "100%",
            }}
          >
            XPUB
          </Text>
        </>
      </TouchableHighlight>
    </Toolbar>
  );
}
