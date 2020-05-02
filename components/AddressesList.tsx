import React, {useState} from "react";
import {RefreshControl, ScrollView} from "react-native";
import {List} from 'react-native-paper';
import AddressesListItem from "./AddressesListItem";
import {useNavigation} from '@react-navigation/native';
import {i18n} from '../translations/i18n';

export default function AddressesList({addresses, onRefresh, afterRefresh, balances, folders, folder}) {

    const [refreshing, setRefreshing] = useState(false);

    const navigation = useNavigation();

    const _onRefresh = async () => {
        setRefreshing(true)
        await onRefresh()
        setRefreshing(false)
        afterRefresh()
    }

    return (
        <ScrollView refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => {
                _onRefresh()
            }}/>}>

            <List.Section>
                <List.Subheader>{i18n.t('addresses')} : </List.Subheader>
                {addresses.map(address => (
                    <AddressesListItem key={address.address} address={{...address, ...balances[address.address]}}
                                       onClick={(address) => navigation.navigate('AddressDetails', {
                                           folders,
                                           addresses,
                                           address,
                                           folder
                                       })}/>)
                )}

            </List.Section>
        </ScrollView>
    )
}

