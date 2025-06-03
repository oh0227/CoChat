import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { updateUserPreference } from "../utils/actions/userActions";
import { useSelector } from "react-redux";

const formatName = (name) => {
  const match = name.match(/"?([^"<]+)"?\s*<([^>]+)>/);
  return match ? `${match[1]} (${match[2]})` : name;
};

const MessageDetailScreen = ({ route }) => {
  const { message, onLike } = route.params;
  const [liked, setLiked] = useState(message.liked);
  const { cochat_id } = useSelector((state) => state.auth.userData);

  const handleLike = async () => {
    if (liked) {
      Alert.alert("이미 좋아요를 누르셨습니다.");
      return;
    }

    Alert.alert(
      "좋아요를 반영할까요?",
      "이 메시지를 기반으로 사용자 취향 벡터가 업데이트되며, 되돌릴 수 없습니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "반영하기",
          style: "destructive",
          onPress: async () => {
            console.log(message.gmail_message_id);

            const result = await updateUserPreference(
              message.gmail_message_id,
              cochat_id
            );

            if (result.success) {
              setLiked(true);
              Alert.alert("성공", "좋아요가 반영되었습니다.");
              onLike?.(message.gmail_message_id);
            } else {
              console.warn("서버 응답 문제:", result.status || result.error);
              Alert.alert("오류", "좋아요 처리 중 문제가 발생했습니다.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon
            name={message.icon || "mail-outline"}
            size={40}
            color={message.iconColor || "#444"}
            style={styles.icon}
          />
          <Text style={styles.title}>Message Detail</Text>
        </View>
        <TouchableOpacity onPress={handleLike}>
          <Icon
            name={liked ? "heart" : "heart-outline"}
            size={28}
            color={liked ? "#e63946" : "#777"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Sender</Text>
        <Text style={styles.text}>{formatName(message.sender_id)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Receiver</Text>
        <Text style={styles.text}>{formatName(message.receiver_id)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Timestamp</Text>
        <Text style={styles.text}>
          {new Date(message.timestamp).toLocaleString()}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Content</Text>
        <Text style={styles.content}>{message.content}</Text>
      </View>
    </ScrollView>
  );
};

export default MessageDetailScreen;

// --- 스타일은 그대로 유지 ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fa",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  text: {
    fontSize: 15,
    color: "#222",
  },
  content: {
    fontSize: 15,
    color: "#222",
    lineHeight: 22,
  },
});
