import React from "react";
import {SwipeListView} from "react-native-swipe-list-view";
import {SwipeButtons} from "./SwipeButtons";
import {RefreshControl} from "react-native";
import {useTheme} from "react-native-paper";

export type SwipeAction = { onclick: (item) => void, text: string, icon: string, color: string, backgroundColor: string };

declare type SwipeListProps = {
    data: object[],
    render: (item) => any,
    keyExtractor: (item) => string,
    showClose?: boolean,
    actions: SwipeAction[],
    refreshing: boolean,
    onRefresh: () => void,
    showPreview?: boolean
}

export function SwipeList(props: SwipeListProps) {

    const {data, render, keyExtractor, showClose, actions, refreshing, onRefresh, showPreview} = {
        actions: [],
        showPreview: false, ...props
    };
    const theme = useTheme();

    return <SwipeListView
        refreshing={refreshing}
        refreshControl={<RefreshControl tintColor={theme.colors.disabled} refreshing={refreshing}
                                        onRefresh={onRefresh}/>}

        renderItem={render}
        renderHiddenItem={(rowData, rowMap) => {
            return <SwipeButtons item={rowData.item} position={'right'} actions={actions} showClose={showClose}
                                 onClose={() => {
                                     rowMap[keyExtractor(rowData.item)].closeRow();
                                     // We use the keyExtractor function to retrieve the key
                                     // and call closeRow on the right row
                                 }} width={80}/>
        }}
        data={data}
        keyExtractor={keyExtractor}
        disableRightSwipe={true}
        rightOpenValue={-80 * ((showClose ? 1 : 0) + actions.length)}
        swipeToOpenPercent={30}
        previewRowKey={showPreview && data.length > 0 ? keyExtractor(data[0]) : ""}
        swipeRowStyle={{
            marginBottom: 1
        }}

    />;
}
