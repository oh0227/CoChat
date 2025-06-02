// components/MessageItem.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const formatName = (name) => {
  if (!name) return "";
  const match = name.match(/"?([^"<]+)"?\s*<([^>]+)>/);
  return match ? `${match[1]} (${match[2]})` : name;
};

const MessageItem = ({
  icon,
  iconColor,
  sender,
  receiver,
  content,
  timestamp,
  onPress,
  liked,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.messageRow}>
      <View style={styles.iconWrapper}>
        <Icon name={icon} size={24} color={iconColor || "#333"} />
      </View>
      <View style={styles.messageContent}>
        <Text style={styles.sender}>{formatName(sender)}</Text>
        <Text style={styles.sender}>{formatName(receiver)}</Text>
        <Text style={styles.preview} numberOfLines={1}>
          {content}
        </Text>
      </View>
      <Text style={styles.timestamp}>{timestamp}</Text>
      <Icon
        name={liked ? "heart" : "heart-outline"}
        size={18}
        color={liked ? "#e63946" : "#ccc"}
        style={{ marginLeft: 8 }}
      />
    </TouchableOpacity>
  );
};

export default MessageItem;

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.5,
  },
  iconWrapper: { width: 30 },
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
