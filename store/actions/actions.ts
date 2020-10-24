import {Settings} from "../../utils/Settings";
import {AddressesList, AddressValue, Folder, FolderAddress, FolderXPubBranch, ListOrderType} from "../../utils/Types";

enum ActionType {
    CLEAR = "CLEAR",
    LOAD_DATA = "LOAD_DATA",
    ADD_FOLDER = "ADD_FOLDER",
    RENAME_FOLDER = "RENAME_FOLDER",
    REMOVE_FOLDER = "REMOVE_FOLDER",
    UPDATE_FOLDERS_TOTAL = "UPDATE_FOLDERS_TOTAL",
    ADD_ADDRESS = "ADD_ADDRESS",
    REMOVE_ADDRESS = "REMOVE_ADDRESS",
    SWAP_FOLDERS = "SWAP_FOLDERS",
    SORT_FOLDERS = "SORT_FOLDERS",
    SWAP_FOLDER_ADDRESSES = "SWAP_FOLDER_ADDRESSES",
    SORT_FOLDER_ADDRESSES = "SORT_FOLDER_ADDRESSES",
    UPDATE_SETTINGS = "UPDATE_SETTINGS",
    UPDATE_ADDRESSES = "UPDATE_ADDRESSES",
    RENAME_ADDRESS = "RENAME_ADDRESS",
    UPDATE_SINGLE_ADDRESS = "UPDATE_SINGLE_ADDRESS",
    UPDATE_LAST_RELOAD_TIME = "UPDATE_LAST_RELOAD_TIME",
    ADD_DERIVED_ADDRESSES = "ADD_DERIVED_ADDRESSES"
}

interface BaseAction<Type extends ActionType> { type: Type; }

export interface ActionClear extends BaseAction<ActionType.CLEAR> {}

export interface ActionLoadData extends BaseAction<ActionType.LOAD_DATA> {
    state: {
        settings: Settings;
        folders: Folder[];
        addresses: AddressValue;
        lastReloadTime: string
    }
}

export interface ActionAddFolder extends BaseAction<ActionType.ADD_FOLDER> {
    folder: Folder;
}

export interface ActionRenameFolder extends BaseAction<ActionType.RENAME_FOLDER> {
    folder: Folder;
    newName: string;
}

export interface ActionRenameAddress extends BaseAction<ActionType.RENAME_ADDRESS> {
    folder: Folder;
    address: FolderAddress;
    newName: string;
}

export interface ActionRemoveFolder extends BaseAction<ActionType.REMOVE_FOLDER> {
    folder: Folder;
}

export interface ActionUpdateFolderTotal extends BaseAction<ActionType.UPDATE_FOLDERS_TOTAL> {
    folder: Folder;
    addressesBalance: AddressesList;
}

export interface ActionAddAddress extends BaseAction<ActionType.ADD_ADDRESS> {
    folder: Folder;
    address: FolderAddress;
}

export interface ActionRemoveAddress extends BaseAction<ActionType.REMOVE_ADDRESS>{
    folder: Folder;
    address: FolderAddress;
}

export interface ActionSwapFolders extends BaseAction<ActionType.SWAP_FOLDERS>{
    folderA: Folder;
    folderB: Folder;
}

export interface ActionSwapFolderAddresses extends BaseAction<ActionType.SWAP_FOLDER_ADDRESSES>{
    folder: Folder;
    addressA: FolderAddress;
    addressB: FolderAddress;
}

export interface ActionSortFolders extends BaseAction<ActionType.SORT_FOLDERS>{
    foldersOrder: ListOrderType;
}

export interface ActionSortFolderAddresses extends BaseAction<ActionType.SORT_FOLDER_ADDRESSES>{
    folderOrder: ListOrderType;
    folder: Folder;
}

export interface ActionUpdateSettings extends BaseAction<ActionType.UPDATE_SETTINGS>{
    settings: Partial<Settings>;
}

export interface ActionUpdateAddress extends BaseAction<ActionType.UPDATE_ADDRESSES> {
    addresses: AddressesList;
}

export interface ActionUpdateSingleAddress extends BaseAction<ActionType.UPDATE_SINGLE_ADDRESS>{
    address: string;
    addressContent: AddressValue
}

export interface ActionUpdateLastReloadTime extends BaseAction<ActionType.UPDATE_LAST_RELOAD_TIME> {}

export interface ActionAddDerivedAddresses extends BaseAction<ActionType.ADD_DERIVED_ADDRESSES>{
    addresses: FolderAddress[];
    folder: Folder;
    branch: FolderXPubBranch;
}

export type Action =
    | ActionClear
    | ActionLoadData
    | ActionAddFolder
    | ActionRemoveFolder
    | ActionRenameFolder
    | ActionRenameAddress
    | ActionUpdateFolderTotal
    | ActionAddAddress
    | ActionRemoveAddress
    | ActionSwapFolders
    | ActionSortFolders
    | ActionSwapFolderAddresses
    | ActionSortFolderAddresses
    | ActionUpdateSettings
    | ActionUpdateAddress
    | ActionUpdateSingleAddress
    | ActionUpdateLastReloadTime
    | ActionAddDerivedAddresses
    ;
