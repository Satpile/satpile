import React from "react";
import {TouchableHighlight} from "react-native";
import {List} from 'react-native-paper';
import SatoshiText from "./SatoshiText";

declare type FoldersListItemProps = {key, folder, onClick:(folder) => void, onLongPress: (folder) => void}

export default function FoldersListItem(props: FoldersListItemProps){

    return (
        <TouchableHighlight
            underlayColor="rgba(0,0,0,0.1)"
            onPress={() => {
                props.onClick(props.folder)
            }}

            onLongPress={() => {
                props.onLongPress(props.folder);
            }}
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


