import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import messaging from "@react-native-firebase/messaging";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../utils/actions/messageActions";
import { addMessage } from "../store/messageSlice";
import MessageItem from "../components/MessageItem";
import { updateUserPreference } from "../utils/actions/userActions";

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
      if (seen.has(msg.gmail_message_id)) return false;
      seen.add(msg.gmail_message_id);
      return true;
    });
  };

  const getGroupedData = (msgs) =>
    msgs.reduce((acc, msg) => {
      const { category } = props.route.params;
      const key = category === "category" ? msg.category : msg.messenger;
      if (!acc[key]) acc[key] = [];
      acc[key].push(msg);
      return acc;
    }, {});

  const groupedData = getGroupedData(messages);

  useEffect(() => {
    if (!userData?.cochat_id) return;
    dispatch(fetchData(userData.cochat_id));
  }, [dispatch, userData?.cochat_id]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const data = remoteMessage.data;

      const newMessage = {
        gmail_message_id: data.gmail_message_id,
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        content: data.content,
        timestamp: data.timestamp,
        icon: data.icon,
        iconColor: data.iconColor,
        category: data.category,
        messenger: data.messenger,
        recommended: data.recommended === "true",
        liked: false,
      };

      dispatch(addMessage(newMessage));

      if (newMessage.recommended) {
        Alert.alert(data.subject || "새 메일", data.content?.slice(0, 50));
      }
    });

    return unsubscribe;
  }, []);

  const handleLike = async (msg) => {
    try {
      await updateUserPreference(msg.id, userData.cochat_id);

      // ✅ 로컬 상태 messages 업데이트
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, liked: true } : m))
      );
    } catch (err) {
      Alert.alert("오류", "좋아요 처리 중 문제가 발생했습니다.");
    }
  };

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
            <MessageItem
              key={msg.gmail_message_id}
              icon={msg.icon}
              iconColor={msg.iconColor}
              sender={msg.sender_id}
              receiver={msg.receiver_id}
              content={msg.content}
              timestamp={msg.timestamp}
              liked={msg.liked}
              onLike={() => handleLike(msg)}
              onPress={() => {
                props.navigation.navigate("MessageDetail", {
                  message: msg,
                  onLike: (msgId) => {
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === msgId ? { ...m, liked: true } : m
                      )
                    );
                  },
                });
              }}
            />
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
});
