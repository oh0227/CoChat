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

const formatName = (name) => {
  const match = name.match(/"?([^"<]+)"?\s*<([^>]+)>/);
  return match ? `${match[1]} (${match[2]})` : name;
};

const MessageDetailScreen = ({ route }) => {
  const { message, onLike } = route.params;
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
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
          onPress: () => {
            setLiked(true);

            // ✅ 사용자 취향 벡터 업데이트 위치
            console.log("사용자 취향 벡터 업데이트:", message.id);
            // TODO: updateUserPreference(message.id);

            // ✅ 상위 컴포넌트에 콜백 전달 (예: 리스트에서 ❤️ 표시)
            if (onLike) {
              onLike(message.id);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with icon and like button */}
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

      {/* Sender */}
      <View style={styles.card}>
        <Text style={styles.label}>Sender</Text>
        <Text style={styles.text}>{formatName(message.sender_id)}</Text>
      </View>

      {/* Receiver */}
      <View style={styles.card}>
        <Text style={styles.label}>Receiver</Text>
        <Text style={styles.text}>{formatName(message.receiver_id)}</Text>
      </View>

      {/* Timestamp */}
      <View style={styles.card}>
        <Text style={styles.label}>Timestamp</Text>
        <Text style={styles.text}>
          {new Date(message.timestamp).toLocaleString()}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.card}>
        <Text style={styles.label}>Content</Text>
        <Text style={styles.content}>{message.content}</Text>
      </View>
    </ScrollView>
  );
};

export default MessageDetailScreen;

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
