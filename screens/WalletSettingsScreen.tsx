import { Appbar, Text, Title, useTheme } from "react-native-paper";
import { Clipboard, Share, View } from "react-native";
import { useTypedDispatch, useTypedSelector } from "../store/store";
import React, { useEffect, useState } from "react";
import { Folder, FolderType } from "../utils/Types";
import { useNavigation, useRoute } from "@react-navigation/native";
import { i18n } from "../translations/i18n";
import DynamicTitle from "../components/DynamicTitle";
import PromptModal from "../components/PromptModal";
import * as Actions from "../store/actions";
import { DisplaySeed } from "../components/DisplaySeed";
import { QRCodeModal } from "../components/QRCodeModal";
import { ActionButton } from "../components/ActionButton";
import { Toast } from "../components/Toast";

const copyAddress = (address: string) => {
  Clipboard.setString(address);
  Toast.showToast({
    duration: 1500,
    message: i18n.t("address_copied"),
    type: "bottom",
  });
};

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

      <View style={{ flexDirection: "row", paddingVertical: 20 }}>
        <View style={{ flex: 1, paddingLeft: 20 }}>
          <Title>{folder.name}</Title>
          <Text selectable={true}>{folder.address}</Text>
          <View
            style={{
              display: "flex",
              alignContent: "center",
              width: 140,
              alignSelf: "center",
              marginTop: 12,
            }}
          >
            <ActionButton
              text={i18n.t("copy")}
              onPress={() => copyAddress(folder.address)}
            />
            <ActionButton
              text={i18n.t("export")}
              onPress={() => Share.share({ message: folder.address })}
              icon={"export"}
              color={"black"}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <QRCodeModal content={folder.address} />
        </View>
      </View>
      {folder.seed && (
        <Text>
          {i18n.t("seed_derivation_path")}
          {"\n"}
          Derivation path : m/84'/0'/0'/0/index{"\n"}
          Derivation path for change: m/84'/0'/0'/1/index
        </Text>
      )}
      {folder.seed && <DisplaySeed seed={folder.seed} />}
    </View>
  );
}
