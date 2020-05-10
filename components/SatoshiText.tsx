import React from "react";
import {convertSatoshiToString} from '../utils/Helper';
import {Text} from "react-native-paper";


export default function SatoshiText({amount, style = {}, ...props}) {
    let currency = amount > 1 ? 'sats' : 'sat';
    return <Text style={style} {...props}>{convertSatoshiToString(amount)} {currency}</Text>;
}
