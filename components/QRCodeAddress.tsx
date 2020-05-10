import QRCode from "react-native-qrcode-svg";
import React from "react";
import {View} from "react-native";

export function QRCodeAddress({address, size}) {

    const padding = Math.floor(size * 0.05);
    return (
        <View style={{
            backgroundColor: 'white',
            padding: padding,
            borderRadius: padding,
            display: 'flex'
        }}>
            <QRCode value={"bitcoin:" + address.address} size={size}/>
        </View>
    );
}
