import {AddressValue, ListOrderType} from "../../utils/Types";
import AddressesStorage from "../../utils/AddressesStorage";

export const loadData = async () => {
    let state = await AddressesStorage.loadState();
    return {type: 'LOAD_DATA', state: state}
}

export const removeFolder = folder => ({
    type: 'REMOVE_FOLDER',
    folder: folder
});

export const addFolder = folder => ({
    type: 'ADD_FOLDER',
    folder: folder
});

export const renameFolder = (folder, newName) => ({
    type: 'RENAME_FOLDER',
    folder, newName
});

export const updateFoldersTotal = addresses => ({
    type: 'UPDATE_FOLDERS_TOTAL',
    addressesBalance: addresses
});

export const updateLastReloadTime = () => ({
    type: 'UPDATE_LAST_RELOAD_TIME'
})

export const addAddressToFolder = (address, folder) => {
    return {
        type: 'ADD_ADDRESS',
        address,
        folder
    }
}

export const updateBalances = (addresses = {}) => {
    return {
        type: 'UPDATE_ADDRESSES',
        addresses
    }
}

export const removeAddressFromFolder = (address, folder) => {
    return {
        type: 'REMOVE_ADDRESS',
        address,
        folder
    }
}

export const updateSingleAddressBalance = (address: string, addressContent: AddressValue) => {
    return {
        type: 'UPDATE_SINGLE_ADDRESS',
        address, addressContent
    }
}

export const swapFolders = ({folderA, folderB}) => {
    return {
        type: "SWAP_FOLDERS",
        folderA, folderB
    }
}

export const sortFolders = (foldersOrder: ListOrderType) => {
    return {
        type: "SORT_FOLDERS",
        foldersOrder
    }
}
