import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const GroupedMessageScreen = (props) => {
  const { groupBy = "category", messages = [] } = props.route.params;

  // 메시지 그룹화 로직
  const groupedData = messages.reduce((acc, msg) => {
    const key = groupBy === "category" ? msg.category : msg.messenger;
    if (!acc[key]) acc[key] = [];
    acc[key].push(msg);
    return acc;
  }, {});

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
                <Text style={styles.sender}>{msg.sender}</Text>
                <Text style={styles.preview} numberOfLines={1}>
                  {msg.preview}
                </Text>
              </View>
              <Text style={styles.timestamp}>{msg.time}</Text>
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
