import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ActivityIndicator, View } from "react-native";

import ChatListScreen from "../screens/ChatListScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ChatScreen from "../screens/ChatScreen";
import NewChatScreen from "../screens/NewChatScreen";

import colors from "../constants/colors";
import commonStyles from "../constants/commonStyles";
import BASE_URL from "../constants/base_url";

import { setChatsData } from "../store/chatSlice";
import { setStoredUsers } from "../store/userSlice";
import { setChatMessages, setStarredMessages } from "../store/messagesSlice";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{ headerTitle: "", headerShadowVisible: false }}
  >
    <Tab.Screen
      name="ChatList"
      component={ChatListScreen}
      options={{
        tabBarLabel: "Chats",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="chatbubble-outline" size={size} color={color} />
        ),
      }}
    />
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
        component={ChatScreen}
        options={{ headerTitle: "", headerBackTitle: "Back" }}
      />
    </Stack.Group>
    <Stack.Group screenOptions={{ presentation: "containedModal" }}>
      <Stack.Screen name="NewChat" component={NewChatScreen} />
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
        const chatsRes = await axios.get(
          `${BASE_URL}/chats/user/${userData.userId}`,
          { headers }
        );
        const chatIds = chatsRes.data;

        const chatsData = {};
        const usersToFetch = new Set();

        for (const chatId of chatIds) {
          // 2. 채팅 상세 정보
          const chatRes = await axios.get(`${BASE_URL}/chats/${chatId}`, {
            headers,
          });
          const chatData = chatRes.data;

          chatsData[chatId] = chatData;

          // 유저 정보 수집
          chatData.users.forEach((userId) => usersToFetch.add(userId));

          // 3. 메시지 가져오기
          const msgRes = await axios.get(`${BASE_URL}/messages/${chatId}`, {
            headers,
          });
          dispatch(setChatMessages({ chatId, messagesData: msgRes.data }));
        }

        // 4. 유저 정보 로딩
        const userMap = {};
        for (const userId of usersToFetch) {
          const userRes = await axios.get(`${BASE_URL}/user/${userId}`, {
            headers,
          });
          userMap[userId] = userRes.data;
        }
        dispatch(setStoredUsers({ newUsers: userMap }));

        // 5. 별표 메시지
        const starredRes = await axios.get(
          `${BASE_URL}/starred/${userData.userId}`,
          { headers }
        );
        dispatch(setStarredMessages({ starredMessages: starredRes.data }));

        // 6. 채팅 정보 저장
        dispatch(setChatsData({ chatsData }));
      } catch (err) {
        console.error("데이터 로딩 실패:", err.response?.data || err.message);
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
