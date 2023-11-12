import {
  CardStyleInterpolators,
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { Dimensions } from "react-native";
import FoldersListScreen from "../screens/FoldersListScreen";
import FolderContentScreen from "../screens/FolderContentScreen";
import AddScreen from "../screens/AddScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AddressDetailsScreen from "../screens/AddressDetailsScreen";
import SettingsEditScreen from "../screens/settings/SettingsEditScreen";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import WalletSettingsScreen from "../screens/WalletSettingsScreen";
import { MessageSigningScreen } from "../screens/MessageSigningScreen";

const Stack = createStackNavigator();

export function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        mode={"modal"}
        screenOptions={{
          ...TransitionPresets.SlideFromRightIOS,
          headerStyle: {
            backgroundColor: "#f47c1c",
            elevation: 0,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "300",
            shadowOpacity: 0,
          },
          headerTitleContainerStyle: {
            width: Dimensions.get("screen").width - 52 * 2,
          },
          headerTitleAlign: "center",
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureEnabled: true,
        }}
        headerMode={"float"}
        initialRouteName={"Home"}
      >
        <Stack.Screen name="Home" component={FoldersListScreen} />
        <Stack.Screen name="FolderContent" component={FolderContentScreen} />
        <Stack.Screen name="WalletSettings" component={WalletSettingsScreen} />
        <Stack.Screen name="Add" component={AddScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="AddressDetails" component={AddressDetailsScreen} />
        <Stack.Screen name="SettingsEdit" component={SettingsEditScreen} />
        <Stack.Screen name="MessageSigning" component={MessageSigningScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
