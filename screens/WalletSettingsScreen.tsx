import { Appbar, Text, useTheme } from "react-native-paper";
import { View } from "react-native";
import { useTypedDispatch, useTypedSelector } from "../store/store";
import React, { useEffect, useState } from "react";
import { Folder, FolderType } from "../utils/Types";
import { useNavigation, useRoute } from "@react-navigation/native";
import { i18n } from "../translations/i18n";
import DynamicTitle from "../components/DynamicTitle";
import PromptModal from "../components/PromptModal";
import * as Actions from "../store/actions";
import { DisplaySeed } from "../components/DisplaySeed";

export default function WalletSettingsScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const folderId = "folder" in params ? (params.folder as string) : null;
  const { folders, addressesBalance } = useTypedSelector((state) => ({
    folders: state.folders,
    addressesBalance: state.addresses,
  }));
  const dispatch = useTypedDispatch();
  const [showRenameModal, setShowRenameModal] = useState(false);
  const theme = useTheme();
  const folder: Folder = folders.find((folder) => folder.uid === folderId);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => (
        <DynamicTitle
          title={folder.name}
          icon={
            folder.type === FolderType.XPUB_WALLET ? "md-wallet" : "md-folder"
          }
          satAmount={folder.totalBalance}
          onPress={() => {
            setShowRenameModal(true);
          }}
        />
      ),
      headerLeft: (props) => (
        <Appbar.BackAction
          color={"white"}
          onPress={() => navigation.goBack()}
        />
      ),
      headerTitleContainerStyle: {
        width: "100%",
        paddingHorizontal: 80,
      },
    });
  }, [navigation, folder]);

  const submitRenameModal = (newName: string) => {
    dispatch(Actions.renameFolder(folder, newName));
  };

  if (!folder) {
    navigation.goBack();
    return null;
  }
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {showRenameModal && (
        <PromptModal
          title={i18n.t("rename_folder")}
          description={i18n.t("enter_folder_name")}
          inputPlaceholder={i18n.t("folder_name")}
          visible={showRenameModal}
          submitLabel={i18n.t("done")}
          onClose={() => setShowRenameModal(false)}
          onValidate={submitRenameModal}
          defaultValue={folder.name}
        />
      )}
      {folder.seed && <DisplaySeed seed={folder.seed} />}
      <Text>{folder.address}</Text>
      <Text>Hardened derivation path : m/84'/0'/0'</Text>
      <Text>
        Full derivation path : m/84'/0'/0'/{"{0,1}"}/{"{0,1,2,3,4...}"}
      </Text>
    </View>
  );
}
