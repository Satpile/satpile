import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from '@expo/vector-icons';
import SatoshiText from "./SatoshiText";

declare type DynamicTitleProps = { title: string, icon?: string, satAmount: number, onPress?: () => void }

/**
 *
 * This component is used for the NavBar title in FolderListScreen and in FolderScreen
 * We use it to customize the default one-line title
 */
export default function DynamicTitle(props: DynamicTitleProps){
    let {title, icon, satAmount} = props;

    return (
        <View style={{alignItems: 'center', flexGrow: 1, width: '100%'}}>
            <View style={{display: 'flex', width: '100%'}}>
                <MainTitle title={title} icon={icon} onPress={props.onPress}/>
            </View>
            <View style={{display: 'flex', width: '100%'}}>
                <SatoshiText style={styles.subTitle} amount={satAmount}/>
            </View>
        </View>
    );
}

export function MainTitle(props: { icon?: string, title: string, onPress?: () => void }) {
    let mainTitle;
    if(props.icon){
        mainTitle =
            <Text numberOfLines={1} style={styles.mainTitle}><Ionicons name={props.icon} size={20}
                                                                       color="white"/> {props.title}</Text>
    }else{
        mainTitle = <Text numberOfLines={1} style={styles.mainTitle}>{props.title}</Text>
    }

    if (props.onPress) {
        return <TouchableOpacity onPress={props.onPress}>{mainTitle}</TouchableOpacity>
    } else {
        return mainTitle;
    }

}


const styles = StyleSheet.create({
    mainTitle: {
        fontSize:20,
        textAlign:'center',
        color: 'white',
        alignSelf: 'center',
    },
    subTitle: {
        textAlign:'center',
        color: 'white'
    }
});
