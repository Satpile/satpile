import {
  AddressesList,
  AddressValue,
  Folder,
  FolderAddress,
  FolderXPubBranch,
  ListOrderType,
} from "../../utils/Types";
import AddressesStorage from "../../utils/AddressesStorage";
import {
  Action,
  ActionAddAddress,
  ActionAddDerivedAddresses,
  ActionAddFolder,
  ActionLoadData,
  ActionRemoveAddress,
  ActionRemoveFolder,
  ActionRenameAddress,
  ActionRenameFolder,
  ActionSortFolderAddresses,
  ActionSortFolders,
  ActionSwapFolderAddresses,
  ActionSwapFolders,
  ActionType,
  ActionUpdateAddress,
  ActionUpdateFolderTotal,
  ActionUpdateLastReloadTime,
  ActionUpdateSingleAddress,
} from "./actions";

export const loadData = async (): Promise<ActionLoadData> => {
  let state = await AddressesStorage.loadState();
  return { type: ActionType.LOAD_DATA, state: state };
};

export const removeFolder = (folder: Folder): ActionRemoveFolder => ({
  type: ActionType.REMOVE_FOLDER,
  folder: folder,
});

export const addFolder = (folder: Folder): ActionAddFolder => ({
  type: ActionType.ADD_FOLDER,
  folder: folder,
});

export const renameFolder = (
  folder: Folder,
  newName: string
): ActionRenameFolder => ({
  type: ActionType.RENAME_FOLDER,
  folder,
  newName,
});

export const renameAddress = (
  folder: Folder,
  address: FolderAddress,
  newName: string
): ActionRenameAddress => ({
  type: ActionType.RENAME_ADDRESS,
  folder,
  address,
  newName,
});

export const updateFoldersTotal = (
  addresses: AddressesList
): ActionUpdateFolderTotal => ({
  type: ActionType.UPDATE_FOLDERS_TOTAL,
  addressesBalance: addresses,
});

export const updateLastReloadTime = (): ActionUpdateLastReloadTime => ({
  type: ActionType.UPDATE_LAST_RELOAD_TIME,
});

export const addAddressToFolder = (
  address: FolderAddress,
  folder: Folder
): ActionAddAddress => {
  return {
    type: ActionType.ADD_ADDRESS,
    address,
    folder,
  };
};

export const updateBalances = (addresses = {}): ActionUpdateAddress => {
  return {
    type: ActionType.UPDATE_ADDRESSES,
    addresses,
  };
};

export const removeAddressFromFolder = (
  address: FolderAddress,
  folder: Folder
): ActionRemoveAddress => {
  return {
    type: ActionType.REMOVE_ADDRESS,
    address,
    folder,
  };
};

export const updateSingleAddressBalance = (
  address: string,
  addressContent: AddressValue
): ActionUpdateSingleAddress => {
  return {
    type: ActionType.UPDATE_SINGLE_ADDRESS,
    address,
    addressContent,
  };
};

export const swapFolders = ({
  folderA,
  folderB,
}: {
  folderA: Folder;
  folderB: Folder;
}): ActionSwapFolders => {
  return {
    type: ActionType.SWAP_FOLDERS,
    folderA,
    folderB,
  };
};

export const swapFolderAddresses = ({
  folder,
  addressA,
  addressB,
}: {
  folder: Folder;
  addressA: FolderAddress;
  addressB: FolderAddress;
}): ActionSwapFolderAddresses => {
  return {
    type: ActionType.SWAP_FOLDER_ADDRESSES,
    folder,
    addressA,
    addressB,
  };
};

export const sortFolders = (foldersOrder: ListOrderType): ActionSortFolders => {
  return {
    type: ActionType.SORT_FOLDERS,
    foldersOrder,
  };
};

export const sortFolderAddresses = (
  folderOrder: ListOrderType,
  folder: Folder
): ActionSortFolderAddresses => {
  return {
    type: ActionType.SORT_FOLDER_ADDRESSES,
    folderOrder,
    folder,
  };
};

export const addDerivedAddresses = (
  folder: Folder,
  branch: FolderXPubBranch,
  addresses: FolderAddress[]
): ActionAddDerivedAddresses => {
  return {
    type: ActionType.ADD_DERIVED_ADDRESSES,
    folder,
    addresses,
    branch,
  };
};

export const updateLoaderStatus = (status: boolean): Action => {
  return {
    type: ActionType.UPDATE_REFRESH_STATUS,
    status,
  };
};
