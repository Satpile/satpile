import React from "react";
import {TouchableHighlight} from "react-native";
import {List} from 'react-native-paper';
import SatoshiText from "./SatoshiText";

declare type FoldersListItemProps = { folder, onClick: (folder) => void, onLongPress: (folder) => void }

export default function FoldersListItem(props: FoldersListItemProps){

    return (
        <TouchableHighlight
            underlayColor="rgb(229,229,229)"
            onPress={() => {
                props.onClick(props.folder)
            }}

            onLongPress={() => {
                props.onLongPress(props.folder);
            }}
            style={{backgroundColor: '#f1f1f1'}}
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


