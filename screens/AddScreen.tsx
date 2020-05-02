import React, {useState} from "react";
import {Alert, Modal, Text, TouchableOpacity, View} from "react-native";
import {i18n} from '../translations/i18n';
import {Appbar, Button, HelperText, TextInput} from "react-native-paper";
import validate from 'bitcoin-address-validation';
import QRCodeButton from "../components/QRCodeButton";
import {MainTitle} from "../components/DynamicTitle";
import {connect} from 'react-redux';
import {addAddressToFolder} from "../store/actions";
import QRCodeScanner from "../components/QRCodeScanner";
import BalanceFetcher from "../utils/BalanceFetcher";
import {Toast} from "../components/Toast";

export default connect(state => ({
    folders: state.folders,
    addresses: state.addresses
}))(function AddScreen({navigation, dispatch, route, addresses, folders}) {

    const [showScanner, setShowScanner] = useState(false);
    const [saving, setSaving] = useState(false);
    const [addressInput, setAddressInput] = useState('');
    const [nameInput, setNameInput] = useState('');

    navigation.setOptions({
        headerTitle: () => <MainTitle title={i18n.t('add')}/>,
        headerLeft: props =>
            <Appbar.BackAction color={"white"} onPress={() => navigation.goBack()}/>
        ,
        headerRight: props =>
            <TouchableOpacity onPress={() => saveAddress()}>
                <Text style={{
                    color: 'white',
                    fontSize: 20,
                    paddingLeft: 15,
                    paddingRight: 15
                }}>{i18n.t('done')}</Text>
            </TouchableOpacity>
    });

    const startScan = () => {
        setShowScanner(true);
    };

    const onScan = (result) => {
        setAddressInput(result);
        setShowScanner(false);
    };

    const saveAddress = async () => {
        if (isAddressValid(addressInput)) {
            setSaving(true);

            let address = addressInput;
            let name = nameInput;

            dispatch(addAddressToFolder({name: name, address: address}, route.params.folder))
            BalanceFetcher.filterAndFetchBalances(false);

            Toast.showToast({type: 'top', message: i18n.t('success_added'), duration: 1500})
            navigation.goBack();

            return true;
        } else {
            Alert.alert(i18n.t('error'), i18n.t('invalid_address'));
            return false;
        }
    }

    const isAddressValid = (str: string) => {
        return validate(str) !== false; //uses lib 'bitcoin-address-validation'
    }

    return (
        <View style={{flex: 1, paddingTop: 20, backgroundColor: 'white', flexDirection: 'column'}}>

            <TextInput style={styles.textInput} label={i18n.t('name')} onChangeText={(text) => {
                setNameInput(text)
            }} value={nameInput}/>

            <View>
                <TextInput style={{...styles.textInput, justifyContent: 'flex-start'}} onChangeText={(text) => {
                    setAddressInput(text)
                }} value={addressInput} label={i18n.t('address')}/>
                <HelperText
                    type="error"
                    visible={!isAddressValid(addressInput) && addressInput.length > 0}
                >
                    {i18n.t('invalid_address')}
                </HelperText>
            </View>
            <View>
                <QRCodeButton onPress={() => {
                    !saving && startScan()
                }}/>
            </View>

            <Button style={{marginTop: 40}} onPress={() => saveAddress()}>{i18n.t('done')}</Button>

            <Modal visible={showScanner} animated={true} animationType={"slide"}>
                <QRCodeScanner onAddressScanned={result => onScan(result)} onCancel={() => {
                    setShowScanner(false)
                }}/>
            </Modal>

        </View>
    )


})
const styles = {
    textInput: {
        marginBottom: 7,
    }
};
