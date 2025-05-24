import React, { useDebugValue, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import messaging from "@react-native-firebase/messaging";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../utils/actions/messageActions";
import { setMessageData } from "../store/messageSlice";
import axios from "axios";
import BASE_URL from "../constants/base_url";

const GroupedMessageScreen = (props) => {
  const dispatch = useDispatch();
  const reduxMessages = useSelector((state) => state.messages.messageData);
  const userData = useSelector((state) => state.auth.userData);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages(removeDuplicates(reduxMessages));
  }, [reduxMessages]);

  const removeDuplicates = (messages) => {
    const seen = new Set();
    return messages.filter((msg) => {
      if (seen.has(msg.id)) return false;
      seen.add(msg.id);
      return true;
    });
  };

  const getGroupedData = (msgs) =>
    msgs.reduce((acc, msg) => {
      const key = props.category === "category" ? msg.category : msg.messenger;
      if (!acc[key]) acc[key] = [];
      acc[key].push(msg);
      return acc;
    }, {});

  const groupedData = getGroupedData(messages);

  // 포그라운드 FCM 수신 처리
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body
      );
    });
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/message/cochat_id/${userData.cochat_id}`
        );

        dispatch(setMessageData({ messageData: res.data }));
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
    return unsubscribe;
  }, []);

  // 백그라운드/종료 상태 수신 (필요시 추가 구현)
  useEffect(() => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      // 백그라운드 수신 시 로직 (로컬 DB 저장 등)
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      {Object.entries(groupedData).map(([groupKey, msgs]) => (
        <View key={groupKey} style={styles.groupBox}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupTitle}>{groupKey.toUpperCase()}</Text>
            <TouchableOpacity>
              <Text style={styles.seeMore}>See More</Text>
            </TouchableOpacity>
          </View>

          {msgs.map((msg, index) => (
            <View key={index} style={styles.messageRow}>
              <View style={styles.iconWrapper}>
                <Icon
                  name={msg.icon}
                  size={24}
                  color={msg.iconColor || "#333"}
                />
              </View>
              <View style={styles.messageContent}>
                <Text style={styles.sender}>{msg.sender_id}</Text>
                <Text style={styles.sender}>{msg.receiver_id}</Text>
                <Text style={styles.preview} numberOfLines={1}>
                  {msg.content}
                </Text>
              </View>
              <Text style={styles.timestamp}>{msg.timestamp}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default GroupedMessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef0fc",
    padding: 14,
  },
  groupBox: {
    marginBottom: 20,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  groupTitle: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#333",
  },
  seeMore: {
    color: "#777",
    fontSize: 13,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.5,
  },
  iconWrapper: {
    width: 30,
  },
  messageContent: {
    flex: 1,
    marginHorizontal: 8,
  },
  sender: {
    fontWeight: "bold",
    fontSize: 13,
  },
  preview: {
    fontSize: 12,
    color: "#666",
  },
  timestamp: {
    fontSize: 11,
    color: "#999",
  },
});
