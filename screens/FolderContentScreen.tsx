import {LayoutAnimation, StyleSheet, View} from "react-native";
import React, {useMemo, useState} from "react";
import DynamicTitle from "../components/DynamicTitle";
import {Appbar, FAB, useTheme} from "react-native-paper";
import ReloadButton from "../components/ReloadButton";
import {connect, useDispatch} from 'react-redux';
import AddressesList from "../components/AddressesList";
import BalanceFetcher from "../utils/BalanceFetcher";
import {i18n} from '../translations/i18n';
import EmptyScreenContent from "../components/EmptyScreenContent";
import PromptModal from "../components/PromptModal";
import * as Actions from "../store/actions";
import store from "../store/store";
import {ReorderToolbar} from "../components/SwipeList/ReorderToolbar";
import {Folder} from "../utils/Types";
import {isSorted} from "../utils/Helper";

export default connect(state => ({
    folders: state.folders,
    addressesBalance: state.addresses
}))(function FolderContentScreen({navigation, route, folders, addressesBalance}) {

    const [showRenameModal, setShowRenameModal] = useState(false);
    const theme = useTheme();
    const folder : Folder = folders.find(folder => folder.uid === route.params.folder.uid);
    const dispatch = useDispatch();
    const [showEditSort, setShowEditSort] = useState(false);
    const [showToolbar, setShowToolbar] = useState(false);

    if (!folder) {
        navigation.goBack();
        return null;
    }
    navigation.setOptions({
        headerTitle: props => <DynamicTitle title={folder.name} icon={"md-folder"} satAmount={folder.totalBalance} onPress={() => { setShowRenameModal(true) }}/>,
        headerLeft: props => <Appbar.BackAction color={"white"} onPress={() => navigation.goBack()}/>,
        headerRight: props => (
            <View style={{display: "flex", flexDirection: "row"}}>
                {folder.addresses.length > 1 && <Appbar.Action
                    key={"open"}
                    color="white"
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
                {showToolbar ? null : <Appbar.Action key={"add"} color="white" icon="plus" onPress={() => navigation.navigate('Add', {folder})}/>}
            </View>),

        headerTitleContainerStyle: {
            width: '100%',
            paddingHorizontal: 80
        }
    });

    const submitRenameModal = (newName) => {
        store.dispatch(Actions.renameFolder(folder, newName));
    }

   const isSortedAlphabetically = useMemo(() => {
       return isSorted(folder.addresses);
   }, [folder.addresses])

    const list = (<>
        <ReorderToolbar
            display={showToolbar}
            onToggleArrows={() => setShowEditSort(!showEditSort)}
            onReorder={(type) => dispatch(Actions.sortFolderAddresses(type, folder))}
            onHide={() => {
                setShowEditSort(false);
                setShowToolbar(false);
            }}
            alreadySorted={isSortedAlphabetically}
        />
        <AddressesList
            addresses={folder.addresses}
            folders={folders}
            folder={folder}
            balances={addressesBalance}
            onRefresh={async () => {
                await BalanceFetcher.filterAndFetchBalances();
            }}
            afterRefresh={() => {
            }}
            onDelete={address => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                dispatch(Actions.removeAddressFromFolder(address, folder))
                dispatch(Actions.updateFoldersTotal(addressesBalance))
            }}
            onSort={(addressA, addressB) => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                dispatch(Actions.swapFolderAddresses({addressA, addressB, folder}));
            }}
            showEditSort={showEditSort}
        /></>);

    return (
        <View style={{flex: 1, backgroundColor: theme.colors.background}}>
            {showRenameModal && <PromptModal title={i18n.t('rename_folder')} description={i18n.t('enter_folder_name')}
                                             inputPlaceholder={i18n.t('folder_name')} visible={showRenameModal}
                                             submitLabel={i18n.t('done')}
                                             onClose={() => setShowRenameModal(false)}
                                             onValidate={submitRenameModal}
                                             defaultValue={folder.name}
            />}
            {folder.addresses.length > 0 ? list : <EmptyScreenContent text={i18n.t('no_address')}/>}
            <ReloadButton/>
            <FAB style={styles.fab} color={"white"} icon={"plus"} onPress={() => navigation.navigate('Add', {folder})}/>
        </View>)
})

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 32,
        right: 0,
        bottom: 0,
        backgroundColor: '#f47c1c',
    },
})
