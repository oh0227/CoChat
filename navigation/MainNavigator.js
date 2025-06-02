import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ActivityIndicator, View } from "react-native";

import SettingsScreen from "../screens/SettingsScreen";
import MessageScreen from "../screens/MessageScreen";

import colors from "../constants/colors";
import commonStyles from "../constants/commonStyles";
import BASE_URL from "../constants/base_url";

import { setMessageData } from "../store/messageSlice";
import GroupedMessageScreen from "../screens/GroupedMessageScreen";
import MessageDetailScreen from "../screens/MessageDetailScreen";
import { initFirebase } from "../utils/firebaseConfig";
import messaging from "@react-native-firebase/messaging";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = ({ messages }) => (
  <Tab.Navigator
    screenOptions={{ headerTitle: "", headerShadowVisible: false }}
  >
    <Tab.Screen
      name="Impotance"
      component={GroupedMessageScreen}
      initialParams={{ category: "category" }}
      options={{
        tabBarLabel: "Impotance",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="heart-outline" size={size} color={color} />
        ),
      }}
    ></Tab.Screen>
    <Tab.Screen
      name="Messenger"
      component={GroupedMessageScreen}
      initialParams={{ category: "messenger" }}
      options={{
        tabBarLabel: "Messenger",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="chatbox" size={size} color={color} />
        ),
      }}
    ></Tab.Screen>
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        tabBarLabel: "Setting",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="settings-outline" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const StackNavigator = ({ messages }) => (
  <Stack.Navigator>
    <Stack.Group>
      <Stack.Screen name="Home" options={{ headerShown: false }}>
        {() => <TabNavigator messages={messages} />}
      </Stack.Screen>
      <Stack.Screen
        name="MessageDetail"
        component={MessageDetailScreen}
        options={{ title: "Message Detail" }}
      />
    </Stack.Group>
  </Stack.Navigator>
);

const MainNavigator = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    initFirebase();

    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log("Authorization status:", authStatus);
      } else {
        Alert.alert("알림 권한이 없습니다", "설정에서 알림을 허용해주세요.");
      }
    };

    requestPermission();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <View style={commonStyles.center}>
        <ActivityIndicator size={"large"} color={colors.primary} />
      </View>
    );
  }

  return <StackNavigator />;
};

export default MainNavigator;
