import React, { useState } from "react";
import { Alert } from "react-native";
import FoldersListItem from "./FoldersListItem";
import { useNavigation } from "@react-navigation/native";
import { i18n } from "../translations/i18n";
import { SwipeList } from "./SwipeList/SwipeList";
import { useTheme } from "../utils/Theme";
import { ReorderButtons } from "./SwipeList/ReorderButtons";
import { Folder } from "../utils/Types";

type Props = {
  folders: Folder[];
  onRefresh: () => Promise<void>;
  afterRefresh: () => void;
  onRemove: (folder: Folder) => void;
  showEditSort: boolean;
  onSort: (folderA: Folder, folderB: Folder) => void;
};

function FoldersList({
  folders,
  onRefresh,
  afterRefresh,
  onRemove,
  showEditSort,
  onSort,
}: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  async function refresh() {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
    afterRefresh();
  }

  function beforeDelete(folder: Folder) {
    Alert.alert(
      i18n.t("delete"),
      i18n.t("delete_folder_sure"),
      [
        { text: i18n.t("cancel"), style: "cancel" },
        {
          text: i18n.t("delete"),
          onPress: async () => {
            onRemove(folder);
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  }

  const navigation = useNavigation();

  return (
    <SwipeList
      data={folders}
      render={(row) => (
        <>
          <FoldersListItem
            folder={row.item}
            onClick={(folder) =>
              navigation.navigate("FolderContent", { folder: folder })
            }
            onLongPress={() => beforeDelete(row.item)}
          />
          <ReorderButtons
            show={showEditSort}
            showUp={row.index > 0}
            showDown={row.index < folders.length - 1}
            onClickDown={() =>
              onSort(folders[row.index], folders[row.index + 1])
            }
            onClickUp={() => onSort(folders[row.index], folders[row.index - 1])}
          />
        </>
      )}
      keyExtractor={(folder) => folder.uid}
      actions={[
        {
          text: i18n.t("delete"),
          onclick: (row) => beforeDelete(row),
          icon: "trash",
          color: "white",
          backgroundColor: "red",
        },
      ]}
      refreshing={refreshing}
      onRefresh={() => refresh()}
      showClose={false}
      showPreview={true}
      disableSwipe={showEditSort}
    />
  );
}

export default FoldersList;
