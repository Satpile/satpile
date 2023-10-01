import React from "react";
import { TouchableHighlight, View } from "react-native";
import { List, Text, useTheme } from "react-native-paper";
import SatoshiText from "./SatoshiText";
import { Folder, FolderType } from "../utils/Types";

declare type FoldersListItemProps = {
  folder: Folder;
  onClick: (folder: Folder) => void;
  onLongPress: (folder: Folder) => void;
};

export const FolderIcon = ({ folderType }: { folderType?: FolderType }) => {
  switch (folderType) {
    case FolderType.SIMPLE:
      return <List.Icon color="#f47c1c" icon="folder" />;
    case FolderType.XPUB_WALLET:
      return <List.Icon color="#f47c1c" icon="wallet" />;
    default:
      return null;
  }
};

export default function FoldersListItem(props: FoldersListItemProps) {
  const theme = useTheme();
  return (
    <TouchableHighlight
      underlayColor={theme.colors.background}
      onPress={() => {
        props.onClick(props.folder);
      }}
      onLongPress={() => {
        props.onLongPress(props.folder);
      }}
      style={{ backgroundColor: theme.colors.surface }}
    >
      <List.Item
        title={props.folder.name}
        description={() => (
          <SatoshiText
            amount={props.folder.totalBalance}
            style={{ color: "#717171" }}
          />
        )}
        left={(listProps) => (
          <FolderIcon folderType={props.folder.type} {...listProps} />
        )}
        right={() => <List.Icon color="#929292" icon="chevron-right" />}
      />
    </TouchableHighlight>
  );
}
