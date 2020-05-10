import React from "react";
import {TouchableHighlight} from "react-native";
import {List, useTheme} from 'react-native-paper';
import SatoshiText from "./SatoshiText";

declare type FoldersListItemProps = { folder, onClick: (folder) => void, onLongPress: (folder) => void }

export default function FoldersListItem(props: FoldersListItemProps){
    const theme = useTheme();
    return (
        <TouchableHighlight
            underlayColor={theme.colors.background}
            onPress={() => {
                props.onClick(props.folder)
            }}

            onLongPress={() => {
                props.onLongPress(props.folder);
            }}
            style={{backgroundColor: theme.colors.surface}}
        >
            <List.Item
                title={props.folder.name}
                description={() => <SatoshiText amount={props.folder.totalBalance} style={{color:'#717171'} } />}
                left={() => <List.Icon color="#f47c1c" icon="folder"/>}
                right={() =>
                    <List.Icon color="#929292" icon="chevron-right"/>
                }

            />
        </TouchableHighlight>
    )
}


