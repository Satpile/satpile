import React, {useState} from "react";
import {Alert} from "react-native";
import FoldersListItem from "./FoldersListItem";
import {useNavigation} from '@react-navigation/native';
import {i18n} from "../translations/i18n";
import {SwipeList} from "./SwipeList/SwipeList";

function FoldersList({ folders, onRefresh, afterRefresh, onRemove }) {

    const [refreshing, setRefreshing] = useState(false);

    async function refresh() {
        setRefreshing(true);
        await onRefresh();
        setRefreshing(false);
        afterRefresh();

    }

    function beforeDelete(folder) {
        Alert.alert(
            i18n.t('delete'),
            i18n.t('delete_folder_sure'),
            [
                {text: i18n.t('cancel'), style: 'cancel'},
                {
                    text: i18n.t('delete'), onPress: async () => {
                        onRemove(folder)
                    }, style: "destructive"
                },
            ],
            {cancelable: true}
        )
    }

    const navigation = useNavigation();

    return <SwipeList
        data={folders}
        render={row => <FoldersListItem folder={row.item}
                                        onClick={(folder) => navigation.navigate('FolderContent', {folder: folder})}
                                        onLongPress={() => beforeDelete(row.item)}/>}
        keyExtractor={folder => folder.uid}
        actions={[
            {
                text: i18n.t('delete'),
                onclick: (row) => beforeDelete(row),
                icon: 'trash',
                color: 'white',
                backgroundColor: 'red'
            }
        ]} refreshing={refreshing} onRefresh={() => refresh()} showClose={true}/>
}



export default FoldersList;
