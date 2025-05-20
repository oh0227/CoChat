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

import { setChatsData } from "../store/chatSlice";
import { setStoredUsers } from "../store/userSlice";
import { setChatMessages, setStarredMessages } from "../store/messagesSlice";
import GroupedMessageScreen from "../screens/GroupedMessageScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const sampleMessages = [
  {
    category: "Deadline Notice",
    messenger: "Gmail",
    sender: "홍길동",
    preview: "졸업보고서 양식 제출",
    time: "9:41 AM",
    icon: "mail",
    iconColor: "#EA4335",
  },
  {
    category: "Payment Notice",
    messenger: "SMS",
    sender: "+82 1234-5678",
    preview: "[KT] 요금 청구 4,610 원",
    time: "9:35 AM",
    icon: "chatbubble-ellipses",
    iconColor: "#32CD32",
  },
  {
    category: "The Others",
    messenger: "Facebook Messenger",
    sender: "김길동",
    preview: "야 너 뭐함?",
    time: "9:35 AM",
    icon: "logo-facebook",
    iconColor: "#4267B2",
  },
];

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{ headerTitle: "", headerShadowVisible: false }}
  >
    <Tab.Screen
      name="Impotance"
      options={{
        tabBarLabel: "Impotance",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="heart-outline" size={size} color={color} />
        ),
      }}
    >
      {() => (
        <GroupedMessageScreen
          route={{ params: { groupBy: "messenger", messages: sampleMessages } }}
        />
      )}
    </Tab.Screen>
    <Tab.Screen
      name="Messenger"
      options={{
        tabBarLabel: "Messenger",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="chatbox" size={size} color={color} />
        ),
      }}
    >
      {() => (
        <GroupedMessageScreen
          route={{ params: { groupBy: "messenger", messages: sampleMessages } }}
        />
      )}
    </Tab.Screen>
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

const StackNavigator = () => (
  <Stack.Navigator>
    <Stack.Group>
      <Stack.Screen
        name="Home"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={MessageScreen}
        options={{ headerTitle: "", headerBackTitle: "Back" }}
      />
    </Stack.Group>
  </Stack.Navigator>
);

const MainNavigator = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const userData = useSelector((state) => state.auth.userData);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // 1. 유저 채팅 목록 가져오기

        const usersToFetch = new Set();

        // 4. 유저 정보 로딩
        const userMap = {};
        for (const userId of usersToFetch) {
          const userRes = await axios.get(`${BASE_URL}/user/${userId}`, {
            headers,
          });
          userMap[userId] = userRes.data;
        }
        dispatch(setStoredUsers({ newUsers: userMap }));
      } catch (error) {
        console.error(
          "데이터 로딩 실패:",
          error.response?.data || error.message
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
