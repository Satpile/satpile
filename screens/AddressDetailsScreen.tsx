import React, { useEffect, useState } from "react";
import {
  Alert,
  Clipboard,
  Modal,
  Platform,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { i18n } from "../translations/i18n";
import { Appbar, Button, Text, Title, useTheme } from "react-native-paper";
import { useSelector, useStore } from "react-redux";
import DynamicTitle from "../components/DynamicTitle";
import * as Actions from "../store/actions";
import ReloadButton from "../components/ReloadButton";
import { Toast } from "../components/Toast";
import ExplorerList from "../components/ExplorersList";
import PromptModal from "../components/PromptModal";
import { Folder, FolderType } from "../utils/Types";
import { useTypedDispatch, useTypedSelector } from "../store/store";
import { ActionButton } from "../components/ActionButton";
import { QRCodeModal } from "../components/QRCodeModal";

export default function AddressDetailsScreen({ navigation, route }) {
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [folders, addresses] = useTypedSelector((state) => [
    state.folders,
    state.addresses,
  ]);
  const dispatch = useTypedDispatch();
  const [bigQRCode, setBigQRCode] = useState(false);
  const store = useStore();
  const theme = useTheme();
  const folder: Folder = folders.find(
    (folder) => route.params.folder.uid === folder.uid
  );
  const address = folder.addresses.find(
    (address) => address.address === route.params.address.address
  );

  if (!address) {
    //Just before going to the previous screen after delete, react re-renders the component because the state has been updated
    //We return an empty element in order to not throw an error
    return <></>;
  }

  const balance = addresses[address.address].balance;
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <DynamicTitle
          title={address.name}
          satAmount={balance}
          onPress={() => setShowRenameModal(true)}
        />
      ),
      headerLeft: (props) => (
        <Appbar.BackAction
          color={"white"}
          onPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation, address, balance]);

  const submitRenameModal = (newName) => {
    dispatch(Actions.renameAddress(folder, address, newName));
  };

  const deleteAddress = () => {
    Alert.alert(i18n.t("delete"), i18n.t("delete_address_sure"), [
      {
        text: i18n.t("cancel"),
        onPress: () => {},
        style: "cancel",
      },
      {
        text: i18n.t("delete"),
        onPress: async () => {
          dispatch(Actions.removeAddressFromFolder(address, folder));
          dispatch(Actions.updateFoldersTotal(addresses));
          navigation.goBack();
        },
        style: "destructive",
      },
    ]);
  };

  const copyAddress = () => {
    Clipboard.setString(address.address);
    Toast.showToast({
      duration: 1500,
      message: i18n.t("address_copied"),
      type: "bottom",
    });
  };

  const exportAddress = () => {
    Share.share({ message: address.address });
  };

  let QRCodeRef = null;

  return (
    <View
      style={{
        display: "flex",
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      {showRenameModal && (
        <PromptModal
          title={i18n.t("rename_address")}
          description={i18n.t("enter_address_name")}
          inputPlaceholder={i18n.t("address_name")}
          visible={showRenameModal}
          submitLabel={i18n.t("done")}
          onClose={() => setShowRenameModal(false)}
          onValidate={submitRenameModal}
          defaultValue={address.name}
        />
      )}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", paddingVertical: 20 }}>
          <View style={{ flex: 1, paddingLeft: 20 }}>
            <Title>{address.name}</Title>
            <Text selectable={true}>{address.address}</Text>
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
                onPress={() => copyAddress()}
              />
              <ActionButton
                text={i18n.t("export")}
                onPress={() => exportAddress()}
                icon={"export"}
                color={"black"}
              />
              {folder.type === FolderType.SIMPLE ? (
                <ActionButton
                  text={i18n.t("delete")}
                  onPress={() => deleteAddress()}
                  color={"red"}
                />
              ) : null}
            </View>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
            }}
          >
            <QRCodeModal content={`bitcoin:${address}`} />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <ExplorerList address={address.address} />
        </View>
        <ReloadButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 0,
    marginVertical: 0,
    padding: 0,
  },
});
