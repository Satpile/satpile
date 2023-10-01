import { LayoutAnimation, View } from "react-native";
import FoldersList from "../components/FoldersList";
import React, { useEffect, useMemo, useState } from "react";
import DynamicTitle from "../components/DynamicTitle";
import { Appbar, useTheme } from "react-native-paper";
import { generateUid, isSorted } from "../utils/Helper";
import PromptModal from "../components/PromptModal";
import ReloadButton from "../components/ReloadButton";
import * as Actions from "../store/actions";
import BalanceFetcher from "../utils/BalanceFetcher";
import EmptyScreenContent from "../components/EmptyScreenContent";
import { useI18n, useLockState, useSettings } from "../utils/Settings";
import { ReorderToolbar } from "../components/SwipeList/ReorderToolbar";
import { Folder, FolderType } from "../utils/Types";
import { AddFolderToolbar } from "../components/AddFolderToolbar";
import store, { useTypedDispatch, useTypedSelector } from "../store/store";
import { TorStatus } from "../components/TorStatus";
import { useNavigation } from "@react-navigation/native";

type TopRightActionsProps = {
  showToolbar: boolean;
  onShowToolbar: () => void;
  showAddToolbar: boolean;
  onShowAddToolbar: () => void;
  folderCount: number;
  onClose: () => void;
};

const TopRightActions = ({
  showToolbar,
  onShowToolbar,
  showAddToolbar,
  onShowAddToolbar,
  folderCount,
  onClose,
}: TopRightActionsProps) => {
  const ActionToolbar = () =>
    folderCount > 1 ? (
      <Appbar.Action
        key={"open"}
        color="white"
        icon={showToolbar ? "close" : "dots-vertical"}
        style={
          showToolbar
            ? {}
            : {
                marginRight: 0,
                paddingLeft: 5,
                width: 24,
              }
        }
        onPress={showToolbar ? onClose : onShowToolbar}
      />
    ) : null;

  const ActionAddToolbar = () => (
    <Appbar.Action
      key={"add"}
      color="white"
      icon={showAddToolbar ? "close" : "plus"}
      onPress={showAddToolbar ? onClose : onShowAddToolbar}
    />
  );

  return (
    <View style={{ display: "flex", flexDirection: "row" }}>
      {!showAddToolbar && <ActionToolbar />}
      {!showToolbar && <ActionAddToolbar />}
    </View>
  );
};

export default function FoldersListScreen() {
  const navigation = useNavigation();
  const { folders, lastReloadTime } = useTypedSelector((state) => ({
    folders: state.folders,
    lastReloadTime: state.lastReloadTime,
  }));
  const dispatch = useTypedDispatch();
  const [totalBalance, setTotalBalance] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditSort, setShowEditSort] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [showAddFolderToolbar, setShowAddFolderToolbar] = useState(false);

  const [settings] = useSettings();
  const theme = useTheme();
  const i18n = useI18n();
  const lockState = useLockState();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <DynamicTitle
          title={i18n.t("home")}
          satAmount={lockState.locked ? null : totalBalance}
        />
      ),
      headerLeft: () => (
        <Appbar.Action
          color="white"
          icon="cog"
          onPress={() => {
            navigation.navigate("Settings");
          }}
        />
      ),
      headerRight: () => (
        <TopRightActions
          onClose={() => {
            setShowToolbar(false);
            setShowEditSort(false);
            setShowAddFolderToolbar(false);
          }}
          folderCount={folders.length}
          onShowAddToolbar={() => setShowAddFolderToolbar(true)}
          onShowToolbar={() => setShowToolbar(true)}
          showAddToolbar={showAddFolderToolbar}
          showToolbar={showToolbar}
        />
      ),
    });
  }, [
    navigation,
    lockState,
    totalBalance,
    folders,
    showAddFolderToolbar,
    showToolbar,
  ]);

  const updateTotalBalance = function () {
    let newTotal = folders.reduce((total, folder) => {
      return total + folder.totalBalance;
    }, 0);
    setTotalBalance(newTotal);
  };

  useEffect(() => {
    updateTotalBalance();
    if (folders.length === 0) {
      setShowToolbar(false);
    }
  }, [folders]);

  //Refresh errored addresses
  useEffect(() => {
    let running = false;
    const interval = setInterval(() => {
      if (running) {
        return;
      }
      running = true;
      BalanceFetcher.filterAndFetchBalances(true, true).finally(() => {
        running = false;
      });
    }, 10 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (settings.refresh > 0) {
      const interval = setInterval(() => {
        let lastReloadTimestamp =
          new Date(store.getState().lastReloadTime).getTime() / 1000;
        let currentTimestamp = Date.now() / 1000;
        if (currentTimestamp - lastReloadTimestamp > settings.refresh) {
          BalanceFetcher.filterAndFetchBalances(true, false);
        }
      }, 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [settings.refresh]);

  const closeModal = () => {
    setShowAddModal(false);
  };

  const submitModal = async (folderName: string) => {
    let folder: Folder = {
      uid: generateUid(),
      name: folderName,
      addresses: [],
      totalBalance: 0,
      orderAddresses: "custom",
      type: FolderType.SIMPLE,
    };

    dispatch(Actions.addFolder(folder));
    setTimeout(() => {
      navigation.navigate("FolderContent", { folder });
    }, 300);
  };

  const isSortedAlphabetically = useMemo(() => {
    return isSorted(folders);
  }, [folders]);

  if (lockState.locked) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }} />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <TorStatus />
      {showAddModal && (
        <PromptModal
          title={i18n.t("new_folder")}
          description={i18n.t("enter_folder_name")}
          inputPlaceholder={i18n.t("folder_name")}
          visible={showAddModal}
          submitLabel={i18n.t("add_folder")}
          onClose={closeModal}
          onCancel={() => {}}
          onValidate={submitModal}
        />
      )}
      <ReorderToolbar
        display={showToolbar}
        onToggleArrows={() => setShowEditSort(!showEditSort)}
        onReorder={(type) => dispatch(Actions.sortFolders(type))}
        alreadySorted={isSortedAlphabetically}
      />
      <AddFolderToolbar
        display={showAddFolderToolbar}
        onHide={() => {
          setShowAddFolderToolbar(false);
        }}
        onAddFolder={() => setShowAddModal(true)}
      />

      {folders.length > 0 ? (
        <FoldersList
          afterRefresh={() => {
            /*this.updateTotalBalance()*/
          }}
          onRefresh={async () => {
            await BalanceFetcher.filterAndFetchBalances();
          }}
          onRemove={(folder) => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            dispatch(Actions.removeFolder(folder));
          }}
          showEditSort={showEditSort}
          onSort={(folderA, folderB) => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            dispatch(Actions.swapFolders({ folderA, folderB }));
          }}
          folders={folders}
        />
      ) : (
        <EmptyScreenContent
          text={i18n.t("no_folder")}
          info={i18n.t("info_xpub")}
        />
      )}

      <ReloadButton />
    </View>
  );
}
