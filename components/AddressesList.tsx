import React, {useState} from "react";
import {Alert} from "react-native";
import {List} from 'react-native-paper';
import AddressesListItem from "./AddressesListItem";
import {useNavigation} from '@react-navigation/native';
import {i18n} from '../translations/i18n';
import {SwipeList} from "./SwipeList/SwipeList";

export default function AddressesList({addresses, onRefresh, afterRefresh, onDelete, balances, folders, folder}) {

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
                render={row => <AddressesListItem address={{...row.item, ...balances[row.item.address]}}
                                                  onClick={(address) => navigation.navigate('AddressDetails', {
                                                      folders,
                                                      addresses,
                                                      address,
                                                      folder
                                                  })}/>}
                keyExtractor={address => address.address}
                actions={[
                    {
                        text: i18n.t('delete'),
                        onclick: (address) => deleteAddress(address)/*beforeDelete(row)*/,
                        icon: 'trash',
                        color: 'white',
                        backgroundColor: 'red'
                    }
                ]} refreshing={refreshing} onRefresh={() => _onRefresh()} showClose={false}/>
        </>
    )
}

