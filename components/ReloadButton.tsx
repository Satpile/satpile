import React from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from '@expo/vector-icons';
import {connect} from 'react-redux';
import BalanceFetcher from "../utils/BalanceFetcher";
import {i18n} from "../translations/i18n";
import {useSettings} from "../utils/Settings";


export default connect(state => ({
    lastReloadTime: state.lastReloadTime,
    folders: state.folders
}))(function ReloadButton({onPress, dispatch, lastReloadTime, folders}) {
    const [settings, updatSettings] = useSettings(); //Call useSettings hook to refresh text when settings change
    if (folders.length === 0) return null;


    return <View style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 10
    }}>
        <TouchableOpacity onPress={() => {
            BalanceFetcher.filterAndFetchBalances();
        }}>
            <View style={{
                display: 'flex',
                padding: 10,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center'
            }}>
                <Text
                    style={{color: '#717171'}}>{lastReloadTime === '' ? i18n.t('tap_reload') : (i18n.t('last_update') + ' ' + i18n.l("date.formats.long", new Date(lastReloadTime)))}</Text>
                <Ionicons style={{paddingTop: 1, paddingLeft: 3}} name={"md-refresh-circle"} color={"gray"} size={20}/>
            </View>
        </TouchableOpacity>
    </View>
})
