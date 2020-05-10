import React from "react";
import {StyleSheet, View} from "react-native";
import SatoshiText from "./SatoshiText";
import {AddressStatusIndicator} from "./AddressStatus";

export default function AddressesListItemValue({address}) {
    return <View style={styles.container}>
        <SatoshiText style={styles.addressValue} amount={address.balance}/>
        <AddressStatusIndicator status={address.status}/>
    </View>;
}

const styles = StyleSheet.create({
    addressValue: {
        textAlign: 'right',
        fontSize: 16,
        marginRight: 10,
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
        marginTop: -4,
        marginRight: 20,
        marginBottom: 4
    }
});
