import { Appbar, Text, Title, useTheme } from "react-native-paper";
import { Alert, Clipboard, ScrollView, Share, View } from "react-native";
import { useTypedDispatch, useTypedSelector } from "../store/store";
import React, { useCallback, useEffect, useState } from "react";
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
import { generateUid } from "../utils/Helper";
import { addDerivedAddresses, addFolder, removeFolder } from "../store/actions";
import {
  initializeAddressesDerivation,
  STARTING_DERIVATION_PATH,
} from "../utils/XPubAddresses";
import BalanceFetcher from "../utils/BalanceFetcher";
import { generateZpubFromMnemonic } from "../utils/Seed";
import { useI18n } from "../utils/Settings";

const copyAddress = (address: string) => {
  Clipboard.setString(address);
  Toast.showToast({
    duration: 1500,
    message: i18n.t("address_copied"),
    type: "bottom",
  });
};

const useDuplicateWallet = () => {
  const navigation = useNavigation();
  const dispatch = useTypedDispatch();
  const [loading, setLoading] = useState(false);
  const duplicate = useCallback(
    async (mnemonic: string, name: string, passphrase?: string) => {
      const address = await generateZpubFromMnemonic(mnemonic, passphrase);
      const newFolder: Folder = {
        uid: generateUid(),
        version: "v2",
        name: name.concat(" (copy)"),
        addresses: [],
        totalBalance: 0,
        orderAddresses: "custom",
        type: FolderType.XPUB_WALLET,
        address: address,
        xpubConfig: {
          branches: STARTING_DERIVATION_PATH.split(",").map((path) => ({
            nextPath: path,
            addresses: [],
          })),
        },
        seed: mnemonic,
        seedPassphrase: passphrase,
      };

      dispatch(addFolder(newFolder));
      setLoading(true);
      setTimeout(() => {
        //Wrap in settimeout to update the UI first
        try {
          newFolder.xpubConfig.branches.forEach((branch) => {
            const firstAddresses = initializeAddressesDerivation(
              newFolder,
              branch
            );
            dispatch(addDerivedAddresses(newFolder, branch, firstAddresses));
          });

          BalanceFetcher.filterAndFetchBalances(false);
          Toast.showToast({
            type: "top",
            message: i18n.t("success_added"),
            duration: 1500,
          });
          navigation.goBack();
          navigation.goBack();

          setTimeout(() => {
            navigation.navigate("FolderContent", { folder: newFolder });
          }, 300);
        } catch (e) {
          dispatch(removeFolder(newFolder));
          Toast.showToast({
            type: "top",
            message: i18n.t("error_added"),
            duration: 2000,
          });
        } finally {
          setLoading(false);
        }
      }, 0);
    },
    []
  );

  return { duplicate, loading };
};

export default function WalletSettingsScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const folderId = "folder" in params ? (params.folder as string) : null;
  const { folders, addressesBalance } = useTypedSelector((state) => ({
    folders: state.folders,
    addressesBalance: state.addresses,
  }));
  const [showPassphraseModal, setShowPassphraseModal] = useState(false);
  const dispatch = useTypedDispatch();
  const [showRenameModal, setShowRenameModal] = useState(false);
  const theme = useTheme();
  const folder: Folder = folders.find((folder) => folder.uid === folderId);
  const { duplicate, loading } = useDuplicateWallet();
  const { t } = useI18n();
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
    <ScrollView
      style={{
        height: "100%",
      }}
    >
      <View style={{ flex: 1 }}>
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

        {showPassphraseModal && (
          <PromptModal
            title={t("change_wallet_passphrase")}
            description={t("change_wallet_passphrase_description")}
            inputPlaceholder={t("change_wallet_passphrase_placeholder")}
            visible={showPassphraseModal}
            submitLabel={i18n.t("done")}
            textInputProps={{
              secureTextEntry: true,
            }}
            onClose={() => setShowPassphraseModal(false)}
            onValidate={(passphrase) => {
              setShowPassphraseModal(false);
              duplicate(folder.seed, folder.name, passphrase).catch((e) => {
                Toast.showToast({
                  type: "top",
                  message: JSON.stringify(e),
                  duration: 2000,
                });
              });
            }}
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
          <View style={{ paddingHorizontal: 20, gap: 20 }}>
            <ActionButton
              text={t("duplicate_wallet")}
              onPress={() => setShowPassphraseModal(true)}
              icon={"refresh"}
              color={"black"}
            />
            <Text>
              {i18n.t("seed_derivation_path")}
              {"\n"}
              Derivation path : m/84'/0'/0'/0/index{"\n"}
              Derivation path for change: m/84'/0'/0'/1/index
            </Text>
            <DisplaySeed seed={folder.seed} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
