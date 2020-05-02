const folders = (state = [], action) => {

    switch (action.type) {
        case 'CLEAR':
            return [];
        case 'LOAD_DATA':
            return action.state.folders;

        case 'ADD_FOLDER':
            //action.folder.addresses = [{name: 'Test 1', address: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy", balance:12345678}]; //TODO: remove
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
    }

    return state;
};

export default folders;
