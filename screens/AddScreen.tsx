import React, {useState} from "react";
import {Alert, Modal, TouchableOpacity, View} from "react-native";
import {i18n} from '../translations/i18n';
import {Appbar, Button, HelperText, Text, TextInput, useTheme} from "react-native-paper";
import QRCodeButton from "../components/QRCodeButton";
import {MainTitle} from "../components/DynamicTitle";
import {connect} from 'react-redux';
import {addAddressToFolder, addDerivedAddresses, addFolder, removeFolder} from "../store/actions";
import {QRCodeScanner} from "../components/QRCodeScanner";
import BalanceFetcher from "../utils/BalanceFetcher";
import {Toast} from "../components/Toast";
import {AddingEnum, Folder, FolderType} from "../utils/Types";
import {generateUid, isAddressValid} from "../utils/Helper";
import {initializeAddressesDerivation, STARTING_DERIVATION_PATH} from "../utils/XPubAddresses";
import {DerivationPathSelector} from "../components/DerivationPathSelector";

export default connect(state => ({
    folders: state.folders,
    addresses: state.addresses
}))(function AddScreen({navigation, dispatch, route, addresses, folders}) {

    const theme = useTheme();
    const [showScanner, setShowScanner] = useState(false);
    const [saving, setSaving] = useState(false);
    const [addressInput, setAddressInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [derivationStartingPath, setDerivationStartingPath] = useState(STARTING_DERIVATION_PATH);

    const addingType = route.params.folder ? AddingEnum.ADDRESS : AddingEnum.XPUB_WALLET;

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
        if (isAddressValid(addressInput, addingType)) {
            setSaving(true);

            let address = addressInput;
            let name = nameInput;

            if(addingType === AddingEnum.ADDRESS){
                dispatch(addAddressToFolder({name: name, address: address}, route.params.folder));
                BalanceFetcher.filterAndFetchBalances(false);
                Toast.showToast({type: 'top', message: i18n.t('success_added'), duration: 1500})
                navigation.goBack();
            } else{
                const newFolder: Folder = {
                    uid: generateUid(),
                    name: name,
                    addresses: [],
                    totalBalance: 0,
                    orderAddresses: "custom",
                    type: FolderType.XPUB_WALLET,
                    address: address,
                    xpubConfig: {
                        nextPath: derivationStartingPath
                    }
                };

                dispatch(addFolder(newFolder));
                try{
                    const firstAddresses = initializeAddressesDerivation(newFolder);
                    dispatch(addDerivedAddresses(newFolder, firstAddresses));

                    BalanceFetcher.filterAndFetchBalances(false);
                    Toast.showToast({type: 'top', message: i18n.t('success_added'), duration: 1500})
                    navigation.goBack();

                    setTimeout(() => {
                        navigation.navigate('FolderContent', {folder: newFolder})
                    }, 300);
                }catch(e) {
                    dispatch(removeFolder(newFolder));
                    Toast.showToast({type: 'top', message: i18n.t('error_added'), duration: 2000})
                }
            }

            return true;
        } else {
            Alert.alert(i18n.t('error'), i18n.t('invalid_address'));
            return false;
        }
    }

    return (
        <View style={{flex: 1, paddingTop: 20, backgroundColor: theme.colors.background, flexDirection: 'column'}}>

            <TextInput style={styles.textInput} label={i18n.t('name')} onChangeText={(text) => {
                setNameInput(text)
            }} value={nameInput}/>

            <View>
                <TextInput style={{...styles.textInput, justifyContent: 'flex-start'}} onChangeText={(text) => {
                    setAddressInput(text)
                }} value={addressInput} label={i18n.t('address')}/>
                <HelperText
                    type="error"
                    visible={!isAddressValid(addressInput, addingType) && addressInput.length > 0}
                >
                    {i18n.t('invalid_address')}
                </HelperText>
            </View>

            {addingType === AddingEnum.XPUB_WALLET && <DerivationPathSelector
                onChange={value => setDerivationStartingPath(value)}
                value={derivationStartingPath}
            />}

            <View>
                <QRCodeButton onPress={() => {
                    !saving && startScan()
                }}/>
            </View>

            <Button style={{marginTop: 40}} onPress={() => saveAddress()}>{i18n.t('done')}</Button>

            <Modal visible={showScanner}
                   animated={true}
                   animationType={"slide"}
                   onDismiss={() => setShowScanner(false)}
                   onRequestClose={() => setShowScanner(false)}>
                <QRCodeScanner onAddressScanned={result => onScan(result)} onCancel={() => {
                    setShowScanner(false)
                }} scanningType={addingType}/>
            </Modal>

        </View>
    )


})
const styles = {
    textInput: {
        marginBottom: 7,
    }
};
