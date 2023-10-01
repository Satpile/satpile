import React, { useMemo, useState } from "react";
import { Alert } from "react-native";
import { List, Text } from "react-native-paper";
import AddressesListItem from "./AddressesListItem";
import { useNavigation } from "@react-navigation/native";
import { i18n } from "../translations/i18n";
import { SwipeList } from "./SwipeList/SwipeList";
import { ReorderButtons } from "./SwipeList/ReorderButtons";
import {
  Folder,
  FolderAddress,
  FolderType,
  AddressesList as AddressesListType,
} from "../utils/Types";
import { useSettings } from "../utils/Settings";

type Props = {
  addresses: FolderAddress[];
  folders: Folder[];
  folder: Folder;
  balances: AddressesListType;
  onRefresh: () => Promise<void>;
  afterRefresh: () => void;
  showEditSort: boolean;
  onDelete: (address: FolderAddress) => void;
  onSort: (addressA: FolderAddress, addressB: FolderAddress) => void;
};

export default function AddressesList({
  addresses,
  onRefresh,
  afterRefresh,
  onDelete,
  balances,
  folders,
  folder,
  showEditSort,
  onSort,
}: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const [settings] = useSettings();
  const navigation = useNavigation();

  const filteredAddresses = useMemo(() => {
    return settings.hideEmptyAddresses
      ? addresses.filter((address) => {
          return (balances[address.address]?.balance || 0) > 0;
        })
      : addresses;
  }, [settings.displayUnit, balances, addresses]);

  const _onRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
    afterRefresh();
  };

  const deleteAddress = (address: FolderAddress) => {
    Alert.alert(
      i18n.t("delete"),
      i18n.t("delete_address_sure"),
      [
        {
          text: i18n.t("cancel"),
          onPress: () => {},
          style: "cancel",
        },
        {
          text: i18n.t("delete"),
          onPress: async () => {
            onDelete(address);
          },
          style: "destructive",
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  return (
    <>
      <List.Subheader>{i18n.t("addresses")} : </List.Subheader>
      <SwipeList
        data={filteredAddresses}
        render={(row) => {
          return (
            <>
              <AddressesListItem
                address={{ ...row.item, ...balances[row.item.address] }}
                onClick={(address) =>
                  navigation.navigate("AddressDetails", {
                    folders,
                    addresses,
                    address,
                    folder,
                  })
                }
              />
              <ReorderButtons
                show={showEditSort}
                showUp={row.index > 0}
                showDown={row.index < addresses.length - 1}
                onClickDown={() =>
                  onSort(addresses[row.index], addresses[row.index + 1])
                }
                onClickUp={() =>
                  onSort(addresses[row.index], addresses[row.index - 1])
                }
                height={78}
              />
            </>
          );
        }}
        keyExtractor={(address) => address.address}
        actions={[
          {
            text: i18n.t("delete"),
            onclick: (address) => deleteAddress(address) /*beforeDelete(row)*/,
            icon: "trash",
            color: "white",
            backgroundColor: "red",
          },
        ]}
        refreshing={refreshing}
        onRefresh={() => _onRefresh()}
        showClose={false}
        disableSwipe={showEditSort || folder.type === FolderType.XPUB_WALLET}
      />

      {settings.hideEmptyAddresses &&
      addresses.length - filteredAddresses.length > 0 ? (
        <Text style={{ textAlign: "center" }}>
          {i18n.t("hidden_addresses", {
            count: addresses.length - filteredAddresses.length,
          })}
        </Text>
      ) : null}
    </>
  );
}
