import React, {useState} from "react";
import {Alert, Clipboard, Modal, Platform, Share, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {i18n} from '../translations/i18n';
import {Appbar, Button, Title} from "react-native-paper";
import QRCode from 'react-native-qrcode-svg';
import {useSelector, useStore} from 'react-redux';
import DynamicTitle from "../components/DynamicTitle";
import * as Actions from '../store/actions';
import ReloadButton from "../components/ReloadButton";
import {Toast} from "../components/Toast";
import ExplorerList from "../components/ExplorersList";
import ViewShot from "react-native-view-shot";
import * as Sharing from 'expo-sharing'

export default function AddressDetailsScreen({navigation, route}) {


    const [folders, addresses] = useSelector(state => [state.folders, state.addresses]);
    const [bigQRCode, setBigQRCode] = useState(false);
    const store = useStore();

    const folder = folders.find(folder => route.params.folder.uid === folder.uid);
    const address = folder.addresses.find(address => address.address === route.params.address.address);

    if (!address) {
        //Just before going to the previous screen after delete, react re-renders the component because the state has been updated
        //We return an empty element in order to not throw an error
        return <></>;
    }

    const balance = addresses[address.address].balance;

    navigation.setOptions({
        headerTitle: () => <DynamicTitle title={address.name} satAmount={balance}/>,
        headerLeft: props => <Appbar.BackAction color={"white"} onPress={() => navigation.goBack()}/>
    });


    const deleteAddress = () => {
        Alert.alert(i18n.t('delete'), i18n.t('delete_address_sure'), [
            {
                text: i18n.t('cancel'),
                onPress: () => {},
                style: 'cancel',
            },
            {
                text: i18n.t('delete'),
                onPress: async () => {
                    store.dispatch(Actions.removeAddressFromFolder(address, folder));
                    store.dispatch(Actions.updateFoldersTotal(addresses));
                    navigation.goBack();

                },
                style: 'destructive',
            }
        ]);
    }


    const copyAddress = () => {
        Clipboard.setString(address.address);
        Toast.showToast({
            duration: 1500,
            message: i18n.t('address_copied'),
            type: "bottom"
        })
    }

    const exportAddress = () => {
        Share.share({message: address.address})
    }

    let QRCodeRef = null;

    return (
        <View style={{display: 'flex', flex: 1}}>
            <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', paddingVertical: 20, backgroundColor: 'white'}}>
                    <View style={{flex: 1, paddingLeft: 20}}>
                        <Title style={{color: 'black'}}>{address.name}</Title>
                        <Text selectable={true}>{address.address}</Text>
                        <View style={{
                            display: 'flex',
                            alignContent: 'center',
                            width: 140,
                            alignSelf: 'center',
                            marginTop: 12
                        }}>
                            <ActionButton text={i18n.t('copy')} onPress={() => copyAddress()}/>
                            <ActionButton text={i18n.t('export')} onPress={() => exportAddress()} icon={"export"}
                                          color={"black"}/>
                            <ActionButton text={i18n.t('delete')} onPress={() => deleteAddress()} color={"red"}/>
                        </View>

                    </View>
                    <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
                        <TouchableOpacity onPress={async () => {
                            setBigQRCode(true);
                        }}>

                            <QRCode
                                value={"bitcoin:" + address.address}
                                size={150}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flex: 1}}>
                    <ExplorerList address={address.address}/>
                </View>
                <View style={{backgroundColor: 'white', height: 60}}>
                    <ReloadButton/>
                </View>
            </View>

            <Modal visible={bigQRCode} animated={true} onDismiss={() => setBigQRCode(false)}
                   onRequestClose={() => setBigQRCode(false)}
                   presentationStyle={"fullScreen"}
                   animationType={"slide"}>
                <View style={{
                    ...StyleSheet.absoluteFillObject,
                    justifyContent: 'center',
                    alignItems: 'center',
                    //   backgroundColor: 'rgba(255,255,255,0.5)'
                }}>
                    <TouchableOpacity onPress={() => {
                        setBigQRCode(false);
                    }}>
                        <ViewShot ref={ref => QRCodeRef = ref} options={{format: 'png', result:'tmpfile'}} style={{padding:10, backgroundColor: 'white'}}>
                            <QRCode
                                value={"bitcoin:" + address.address}
                                size={240}
                            />
                        </ViewShot>
                    </TouchableOpacity>
                    <ActionButton text={i18n.t('share_qrcode')}  style={{marginTop: 10}}  color={'black'} icon={"export"} onPress={async () => {
                        let uri = await QRCodeRef.capture();
                        shareImage(uri);
                    }} />
                    <Button style={{marginBottom: -80, marginTop: 80}} onPress={() => setBigQRCode(false)}>{i18n.t('close')}</Button>

                </View>
            </Modal>
        </View>
    )
}


let ActionButton = ({onPress, text, ...props}) => {
    return <Button
        contentStyle={{
            alignSelf: 'flex-start',
            ...(!props.icon ? {paddingLeft: 5} : {}),

        }}
        labelStyle={{
            marginVertical: 6
        }}
        style={{
            marginVertical: 3
        }}
        mode={"outlined"}
        compact={true}
        onPress={onPress}
        {...props}>{text}</Button>
}

async function shareImage(uri){
    switch(Platform.OS){
        case "android":
            if(await Sharing.isAvailableAsync()) {
                Sharing.shareAsync(uri, {
                    mimeType: 'image/png'
                })
            }
            break;
        case "ios":
            Share.share({
                title:'QRCode',
                url:uri
            }, {
                dialogTitle: 'Share QRCode'
            })
        break;
    }
}

const styles = StyleSheet.create({
    button: {
        marginHorizontal: 0,
        marginVertical: 0,
        padding: 0
    }
})
