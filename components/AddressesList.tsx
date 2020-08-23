import React, {useState} from "react";
import {Alert} from "react-native";
import {List} from 'react-native-paper';
import AddressesListItem from "./AddressesListItem";
import {useNavigation} from '@react-navigation/native';
import {i18n} from '../translations/i18n';
import {SwipeList} from "./SwipeList/SwipeList";
import {ReorderButtons} from "./SwipeList/ReorderButtons";
import {FolderType} from "../utils/Types";

export default function AddressesList({addresses, onRefresh, afterRefresh, onDelete, balances, folders, folder, showEditSort, onSort}) {

    const [refreshing, setRefreshing] = useState(false);

    const navigation = useNavigation();

    const _onRefresh = async () => {
        setRefreshing(true)
        await onRefresh()
        setRefreshing(false)
        afterRefresh()
    }

    const deleteAddress = (address) => {
        Alert.alert(i18n.t('delete'), i18n.t('delete_address_sure'), [
            {
                text: i18n.t('cancel'),
                onPress: () => {
                },
                style: 'cancel',
            },
            {
                text: i18n.t('delete'),
                onPress: async () => {
                    onDelete(address);

                },
                style: 'destructive',
            }
        ], {
            cancelable: true
        });
    }

    return (
        <>
            <List.Subheader>{i18n.t('addresses')} : </List.Subheader>
            <SwipeList
                data={addresses}
                render={row => {
                    return <>
                        <AddressesListItem
                            address={{...row.item, ...balances[row.item.address]}}
                            onClick={(address) => navigation.navigate('AddressDetails', {
                                folders,
                                addresses,
                                address,
                                folder
                            })}
                        />
                        <ReorderButtons
                            show={showEditSort}
                            showUp={row.index > 0}
                            showDown={row.index < addresses.length - 1}
                            onClickDown={() => onSort(addresses[row.index], addresses[row.index + 1])}
                            onClickUp={() => onSort(addresses[row.index], addresses[row.index - 1])}
                            height={78}
                        />
                    </>;
                }}
                keyExtractor={address => address.address}
                actions={[
                    {
                        text: i18n.t('delete'),
                        onclick: (address) => deleteAddress(address)/*beforeDelete(row)*/,
                        icon: 'trash',
                        color: 'white',
                        backgroundColor: 'red'
                    }
                ]} refreshing={refreshing} onRefresh={() => _onRefresh()} showClose={false} disableSwipe={showEditSort || folder.type === FolderType.XPUB_WALLET}/>
        </>
    )
}

