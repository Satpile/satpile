import {View} from "react-native";
import {Title} from "react-native-paper";
import React from "react";

export default ({text}) => (
    <View style={{
        alignContent: 'center',
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: '15%',
        paddingTop: 200
    }}>
        <Title style={{color: "#606060", textAlign: 'center'}}>{text}</Title>
    </View>
);
