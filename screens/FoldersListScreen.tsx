import {View} from "react-native";
import FoldersList from "../components/FoldersList";
import React, {useEffect, useState} from "react";
import DynamicTitle from "../components/DynamicTitle";
import {Appbar} from "react-native-paper";
import {generateUid} from '../utils/Helper';
import PromptModal from "../components/PromptModal";
import ReloadButton from "../components/ReloadButton";
import * as Actions from "../store/actions";
import {connect} from 'react-redux';
import BalanceFetcher from "../utils/BalanceFetcher";
import EmptyScreenContent from "../components/EmptyScreenContent";
import {useI18n, useSettings} from "../utils/Settings";


export default connect(state => ({
    folders: state.folders,
    lastReloadTime: state.lastReloadTime
}))(function FoldersListScreen({navigation, folders, dispatch, lastReloadTime}) {

    const [totalBalance, setTotalBalance] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [settings] = useSettings();

    const i18n = useI18n();

    navigation.setOptions({
        headerTitle:
            props => <DynamicTitle title={i18n.t('home')} satAmount={totalBalance} />,
        headerLeft: props =>
            <Appbar.Action color="white" icon="settings" onPress={() => {
                navigation.navigate('Settings')
                //dispatch({type:'CLEAR'});
            }}/>
        ,
        headerRight: props =>
            <Appbar.Action color="white" icon="plus" onPress={() => {
                setShowAddModal(true);
            }}/>
    });

    const updateTotalBalance = function(){
        let newTotal = folders.reduce((total, folder) => {
            return total+folder.totalBalance;
        }, 0);
        setTotalBalance(newTotal);
    };

    useEffect(() => {
        updateTotalBalance();
    });

    useEffect(() => {
        if (settings.refresh > 0) {
            const interval = setInterval(() => {
                // @ts-ignore
                let lastReloadTimestamp = (new Date(lastReloadTime)) / 1000;
                let currentTimestamp = Date.now() / 1000;
                if ((currentTimestamp - lastReloadTimestamp) > settings.refresh) {
                    BalanceFetcher.backgroundFetch();
                }
            }, 10 * 1000);
            return () => clearInterval(interval);
        }
    }, [settings.refresh, lastReloadTime]);


    const closeModal = () => {
        setShowAddModal(false);
    }

    const submitModal = async (folderName) => {
        let folder = {
            uid: generateUid(),
            name: folderName,
            addresses: [],
            totalBalance: 0
        };

        dispatch(Actions.addFolder(folder));
    };


    return (
        <View style={{flex: 1}}>
            {showAddModal && <PromptModal title={i18n.t('new_folder')} description={i18n.t('enter_folder_name')}
                                          inputPlaceholder={i18n.t('folder_name')} visible={showAddModal}
                                          submitLabel={i18n.t('add_folder')}
                                          onClose={closeModal}
                                          onCancel={() => {
                         }}
                                          onValidate={submitModal}
            />}
            {folders.length > 0 ? <FoldersList
                afterRefresh={() => {/*this.updateTotalBalance()*/
                }}
                onRefresh={async () => {
                    await BalanceFetcher.filterAndFetchBalances();
                }}
                onRemove={folder => dispatch(Actions.removeFolder(folder))}
                folders={folders}
            /> : <EmptyScreenContent text={i18n.t('no_folder')}/>}

            <ReloadButton/>
        </View>)
})
