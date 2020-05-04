import React from "react";
import {SwipeListView} from "react-native-swipe-list-view";
import {SwipeButtons} from "./SwipeButtons";
import {RefreshControl} from "react-native";

export type SwipeAction = { onclick: (item) => void, text: string, icon: string, color: string, backgroundColor: string };

declare type SwipeListProps = { data: object[], render: (item) => any, keyExtractor: (item) => string, showClose?: boolean, actions: SwipeAction[], refreshing: boolean, onRefresh: () => void }

export function SwipeList(props: SwipeListProps) {

    const {data, render, keyExtractor, showClose, actions, refreshing, onRefresh} = {actions: [], ...props};


    return <SwipeListView
        refreshing={refreshing}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}

        renderItem={render}
        renderHiddenItem={(rowData, rowMap) => {
            return <SwipeButtons item={rowData.item} position={'right'} actions={actions} showClose={showClose}
                                 onClose={() => {
                                     rowMap[keyExtractor(rowData.item)].closeRow(); //We use the keyExtractor function to retrieve the key and call closeRow on the right row
                                 }} width={80}/>
        }}
        data={data}
        keyExtractor={keyExtractor}
        disableRightSwipe={true}
        rightOpenValue={-80 * ((showClose ? 1 : 0) + actions.length)}
        swipeToOpenPercent={30}
        previewRowKey={keyExtractor(data[0])}

    />;
}
