import {LayoutAnimation, View} from "react-native";
import FoldersList from "../components/FoldersList";
import React, {useEffect, useMemo, useState} from "react";
import DynamicTitle from "../components/DynamicTitle";
import {Appbar, useTheme} from "react-native-paper";
import {generateUid, isSorted} from '../utils/Helper';
import PromptModal from "../components/PromptModal";
import ReloadButton from "../components/ReloadButton";
import * as Actions from "../store/actions";
import {connect} from 'react-redux';
import BalanceFetcher from "../utils/BalanceFetcher";
import EmptyScreenContent from "../components/EmptyScreenContent";
import {useI18n, useSettings} from "../utils/Settings";
import {ReorderToolbar} from "../components/SwipeList/ReorderToolbar";

export default connect(state => ({
    folders: state.folders,
    lastReloadTime: state.lastReloadTime
}))(function FoldersListScreen({navigation, folders, dispatch, lastReloadTime}) {
    const [totalBalance, setTotalBalance] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditSort, setShowEditSort] = useState(false);
    const [showToolbar, setShowToolbar] = useState(false);

    const [settings] = useSettings();
    const theme = useTheme();
    const i18n = useI18n();

    navigation.setOptions({
        headerTitle: _ => <DynamicTitle title={i18n.t('home')} satAmount={totalBalance} />,
        headerLeft: _ => <Appbar.Action color="white" icon="settings" onPress={() => { navigation.navigate('Settings') }}/>
        ,
        headerRight: _ => <View style={{display: "flex", flexDirection: "row"}}>
            {folders.length > 1 && <Appbar.Action
                key={"open"} color="white"
                icon={showToolbar ? "close" : "dots-vertical"}
                style={showToolbar ? {} : {
                    marginRight: 0,
                    paddingLeft: 5,
                    width: 24
                }}
                onPress={() => {
                    setShowToolbar(!showToolbar);
                    setShowEditSort(false);
                }}/>}
            {showToolbar  ? null : <Appbar.Action key={"add"} color="white" icon="plus" onPress={() => {
                setShowAddModal(true);
            }}/>}
            </View>
    });

    const updateTotalBalance = function(){
        let newTotal = folders.reduce((total, folder) => {
            return total+folder.totalBalance;
        }, 0);
        setTotalBalance(newTotal);
    };

    useEffect(() => {
        updateTotalBalance();
        if(folders.length === 0){
            setShowToolbar(false);
        }
    }, [folders]);

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

    const isSortedAlphabetically = useMemo(() => {
        return isSorted(folders);
    }, [folders])

    return (
        <View style={{flex: 1, backgroundColor: theme.colors.background}}>
            {showAddModal &&
                (<PromptModal
                    title={i18n.t('new_folder')}
                    description={i18n.t('enter_folder_name')}
                    inputPlaceholder={i18n.t('folder_name')}
                    visible={showAddModal}
                    submitLabel={i18n.t('add_folder')}
                    onClose={closeModal}
                    onCancel={() => {}}
                    onValidate={submitModal}
                />)
            }
            <ReorderToolbar
                display={showToolbar}
                onToggleArrows={() => setShowEditSort(!showEditSort)}
                onReorder={(type) => dispatch(Actions.sortFolders(type))}
                onHide={() => {
                    setShowEditSort(false);
                    setShowToolbar(false);
                }}
                alreadySorted={isSortedAlphabetically}
            />

            {folders.length > 0 ? <FoldersList
                afterRefresh={() => {/*this.updateTotalBalance()*/
                }}
                onRefresh={async () => {
                    await BalanceFetcher.filterAndFetchBalances();
                }}
                onRemove={folder => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    dispatch(Actions.removeFolder(folder))
                }}
                showEditSort={showEditSort}
                onSort={(folderA, folderB) => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    dispatch(Actions.swapFolders({folderA, folderB}));
                }}
                folders={folders}
            /> : <EmptyScreenContent text={i18n.t('no_folder')}/>}

            <ReloadButton/>
        </View>)
})
