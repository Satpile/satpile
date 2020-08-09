import {Folder, FolderAddress, FolderType} from "../../utils/Types";
import {Action} from "../actions/actions";

const folders = (state: Folder[] = [], action: Action) => {

    switch (action.type) {
        case 'CLEAR':
            return [];
        case 'LOAD_DATA':
            return action.state.folders.map(folder => {
                return {
                    type: FolderType.SIMPLE, //Backward compatibility, set default folder type
                    ...folder,
                }
            });

        case 'ADD_FOLDER':
            return [...state, action.folder];

        case 'RENAME_FOLDER':
            const newName = action.newName;
            const updatedFolder = {...action.folder, name: newName};
            return state.map(folder => {
                if (folder.uid === updatedFolder.uid) {
                    return updatedFolder;
                } else {
                    return folder;
                }
            });
        case 'REMOVE_FOLDER':
            return state.filter(folder => folder.uid != action.folder.uid);

        case 'UPDATE_FOLDERS_TOTAL':
            return state.map(folder => {
                let folderBalance = folder.addresses.reduce((total, address) => {
                    return total + action.addressesBalance[address.address].balance;
                }, 0)

                return {...folder, totalBalance: folderBalance};
            })

        case 'ADD_ADDRESS':
            return state.map(folder => {
                if (folder.uid === action.folder.uid) {
                    if (folder.addresses.find(address => address.address === action.address.address) === undefined) {
                        return {
                            ...folder,
                            addresses: [...folder.addresses, {
                                address: action.address.address,
                                name: action.address.name
                            }]
                        };
                    } else {
                        return {...folder};
                    }
                }
                return folder;
            });

        case 'REMOVE_ADDRESS':
            //Find the right folder then filter out the address to remove
            return state.map(folder => {
                if (folder.uid === action.folder.uid) {
                    return {
                        ...folder,
                        addresses: folder.addresses.filter(address => address.address !== action.address.address)
                    }
                }
                return folder;
            });
        case 'SWAP_FOLDERS':
            const {folderA, folderB} = action;

            return state.map(value => {
                if(value.uid === folderA.uid) return folderB;
                if(value.uid === folderB.uid) return folderA;
                return value;
            })

        case 'SORT_FOLDERS': {
            switch (action.foldersOrder) {
                case "alphabetically" : return [...state].sort((a:Folder, b: Folder) => {
                    if(a.name < b.name) return -1;
                    if(a.name > b.name) return 1;
                    return 0;
                });
                case "alphabetically-desc": return [...state].sort((a:Folder, b: Folder) => {
                    if(a.name < b.name) return 1;
                    if(a.name > b.name) return -1;
                    return 0;
                });
                default: return state;
            }

        }

        case 'SWAP_FOLDER_ADDRESSES':
            const {addressA, addressB, folder: inFolder} = action;
            return state.map(folder => { //Foreach folder
                if(folder.uid === inFolder.uid){ //Find target folder
                    return {
                        ...inFolder,
                        orderAddresses: "custom",
                        addresses: inFolder.addresses.map(address => { //For each addresses in folder
                            if(address.address === addressA.address) return addressB; //Swap if address found
                            if(address.address === addressB.address) return addressA;
                            return address;
                        })
                    };
                }

                return folder;
            })

        case 'SORT_FOLDER_ADDRESSES': {
            switch (action.folderOrder) {
                case "alphabetically": {
                    return state.map(folder => { //Foreach folder
                        if (folder.uid === action.folder.uid) { //Find target folder
                            return {
                                ...folder,
                                orderAddresses: "alphabetically",
                                addresses: [...folder.addresses].sort((a:FolderAddress, b: FolderAddress) => { //Sort content
                                    if(a.name < b.name) return -1;
                                    if(a.name > b.name) return 1;
                                    return 0;
                                })
                            }
                        }
                        return folder;
                    });
                }
                case "alphabetically-desc": {
                    return state.map(folder => { //Foreach folder
                        if (folder.uid === action.folder.uid) { //Find target folder
                            return {
                                ...folder,
                                orderAddresses: "alphabetically-desc",
                                addresses: [...folder.addresses].sort((a:FolderAddress, b: FolderAddress) => { //Sort content
                                    if(a.name < b.name) return 1;
                                    if(a.name > b.name) return -1;
                                    return 0;
                                })
                            }
                        }
                        return folder;
                    });
                }
                default: return state;
            }
        }
    }

    return state;
};

export default folders;
