import React from "react";
import {Text} from "react-native";
import {convertSatoshiToString} from '../utils/Helper';


export default function SatoshiText({amount, ...props}){
    let currency = amount > 1 ? 'sats' : 'sat';
    return <Text {...props}>{convertSatoshiToString(amount)} {currency}</Text>;
}
