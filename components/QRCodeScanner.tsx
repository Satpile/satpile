import React from "react";
import {BarCodeScanner} from "expo-barcode-scanner";
import {Image, StatusBar, StyleSheet, View} from "react-native";
import * as Permissions from "expo-permissions";
import {Appbar, Subheading} from "react-native-paper";

import validate from 'bitcoin-address-validation';
import {i18n} from "../translations/i18n";

export default class QRCodeScanner extends React.Component<{ onAddressScanned, onCancel }> {

    state = {hasCameraPermission: null};

    async componentDidMount() {
        this.getPermissionsAsync();
    }

    getPermissionsAsync = async () => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({hasCameraPermission: status === 'granted'});
    };

    onScan(result) {
        if (result.type === BarCodeScanner.Constants.BarCodeType.qr) {
            let address = result.data.replace('bitcoin:', '');
            if (validate(address)) {
                this.props.onAddressScanned(address);
            }
        }
    }

    render() {
        return (
            <View style={{...StyleSheet.absoluteFillObject, flex: 1, backgroundColor: 'black'}}>
                <StatusBar backgroundColor={"#000000"} animated={false}/>
                {this.state.hasCameraPermission &&
                <BarCodeScanner style={{...StyleSheet.absoluteFillObject, backgroundColor: "black"}}
                                onBarCodeScanned={(v) => {
                                    this.onScan(v)
                                }}/>}
                <Appbar.Header
                    style={{paddingLeft: 10, paddingRight: 10, backgroundColor: 'rgba(10,10,10,0.4)', paddingTop: 0}}>
                    <Subheading onPress={() => this.props.onCancel()}
                                style={{flex: 1, color: 'white', textAlign: 'left'}}>{i18n.t('cancel')}</Subheading>
                </Appbar.Header>
                <View
                    style={{flex: 1, marginBottom: 20, justifyContent: 'center', alignItems: 'center'}}>
                    <Image style={{height: 300, width: 300}} source={require('../assets/scanning.png')}/>
                </View>
            </View>
        );
    }
}
