import React from "react";
import {
  IPropsSwipeListView,
  SwipeListView,
} from "react-native-swipe-list-view";
import { SwipeButtons } from "./SwipeButtons";
import { RefreshControl } from "react-native";
import { useTheme } from "react-native-paper";
import { FAIconName } from "../../utils/Types";

export type SwipeAction<T> = {
  onclick: (item: T) => void;
  text: string;
  icon: FAIconName;
  color: string;
  backgroundColor: string;
};

declare type SwipeListProps<T> = {
  data: T[];
  render: IPropsSwipeListView<T>["renderItem"];
  keyExtractor: (item: T) => string;
  showClose?: boolean;
  actions: SwipeAction<T>[];
  refreshing: boolean;
  onRefresh: () => void;
  showPreview?: boolean;
  disableSwipe?: boolean;
};

export function SwipeList<T>(props: SwipeListProps<T>) {
  const {
    data,
    render,
    keyExtractor,
    showClose = true,
    actions = [],
    refreshing,
    onRefresh,
    showPreview,
    disableSwipe,
  } = {
    showPreview: false,
    disableSwipe: false,
    ...props,
  };
  const theme = useTheme();

  return (
    <SwipeListView
      refreshing={refreshing}
      refreshControl={
        <RefreshControl
          tintColor={theme.colors.disabled}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      renderItem={render}
      renderHiddenItem={(rowData, rowMap) => {
        return (
          <SwipeButtons
            item={rowData.item}
            position={"right"}
            actions={actions}
            showClose={showClose}
            onClose={() => {
              rowMap[keyExtractor(rowData.item)].closeRow();
              // We use the keyExtractor function to retrieve the key
              // and call closeRow on the right row
            }}
            width={80}
          />
        );
      }}
      data={data}
      keyExtractor={keyExtractor}
      disableRightSwipe={true}
      disableLeftSwipe={disableSwipe}
      rightOpenValue={-80 * ((showClose ? 1 : 0) + actions.length)}
      swipeToOpenPercent={30}
      previewRowKey={
        showPreview && data.length > 0 ? keyExtractor(data[0]) : ""
      }
      swipeRowStyle={{
        marginBottom: 1,
      }}
    />
  );
}
