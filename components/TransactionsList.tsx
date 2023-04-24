import React from "react";
import { ScrollView, View } from "react-native";
import { Divider, List } from "react-native-paper";
import SatoshiText from "./SatoshiText";
import { i18n } from "../translations/i18n";

export default function TransactionsList({ transactions }) {
  return (
    <ScrollView style={{}}>
      <List.Section>
        {transactions.map((transaction, i) => (
          <View key={transaction.hash}>
            <Transaction transaction={transaction} />
            {i < transactions.length - 1 && (
              <Divider style={{ marginHorizontal: 15 }} />
            )}
          </View>
        ))}
      </List.Section>
    </ScrollView>
  );
}

function transactionColor(direction) {
  switch (direction) {
    case "in":
      return "rgb(9,145,0)";
    case "out":
      return "rgb(144,0,2)";
  }
}

function transactionDescription({ direction, address }) {
  let prefixes = {
    in: i18n.t("from"),
    out: i18n.t("to"),
  };

  return prefixes[direction] + ": " + address;
}

function Transaction({ transaction }) {
  return (
    <List.Item
      title={i18n.l("date.formats.short", transaction.date)}
      description={transactionDescription(transaction)}
      descriptionEllipsizeMode={"middle"}
      descriptionNumberOfLines={1}
      right={(props) => <SatValue {...transaction} />}
    />
  );
}

function SatValue({ amount, direction }) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignContent: "flex-end",
        marginRight: 5,
        marginTop: 6,
      }}
    >
      <SatoshiText
        style={{
          color: transactionColor(direction),
          textAlign: "right",
          fontSize: 16,
        }}
        amount={amount}
      />
    </View>
  );
}
