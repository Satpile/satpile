import React, {useState} from "react";
import {Alert, RefreshControl, ScrollView} from "react-native";
import {List} from 'react-native-paper';

import FoldersListItem from "./FoldersListItem";
import {useNavigation} from '@react-navigation/native';
import {i18n} from "../translations/i18n";

function FoldersList({ folders, onRefresh, afterRefresh, onRemove }) {

    const [refreshing, setRefreshing] = useState(false);

    async function refresh() {
        setRefreshing(true);
        await onRefresh();
        setRefreshing(false);
        afterRefresh();

    }

    const navigation = useNavigation();

    return (
        <ScrollView refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => {
                refresh()
            }}/>}>

            {/*<Title style={{textAlign:'center'}}>Total {this.props.addresses.reduce((val, address) => address.value_fiat + val, 0)} €</Title>*/}
            <List.Section>
                {folders.map(folder =>
                    <FoldersListItem key={folder.uid} folder={folder}
                                     onClick={(folder) => navigation.navigate('FolderContent', {folder: folder})}
                                     onLongPress={folder => {
                                         Alert.alert(
                                             i18n.t('delete'),
                                             i18n.t('delete_folder_sure'),
                                             [
                                                 {text: i18n.t('cancel'), style: 'cancel'},
                                                 {
                                                     text: i18n.t('delete'), onPress: async () => {
                                                     onRemove(folder)
                                                     }, style:"destructive"},
                                             ],
                                             {cancelable: true}
                                         )
                                     }}
                    />
                )}

            </List.Section>
        </ScrollView>
    )
}

export default FoldersList;
