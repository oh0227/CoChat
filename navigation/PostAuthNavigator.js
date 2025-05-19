import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MessengerSetUpScreen from "../screens/MessengerSetUpScreen";

import MainNavigator from "./MainNavigator";
import AccountSetupScreen from "../screens/AccountSetUpScreen";
import NoticeTypeScreen from "../screens/NoticeTypeScreen";

const Stack = createNativeStackNavigator();

const PostAuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MessengerSetUp" component={MessengerSetUpScreen} />
      <Stack.Screen name="AccountSetUp" component={AccountSetupScreen} />
      <Stack.Screen name="NoticeType" component={NoticeTypeScreen} />
      <Stack.Screen name="Main" component={MainNavigator} />
    </Stack.Navigator>
  );
};

export default PostAuthNavigator;
