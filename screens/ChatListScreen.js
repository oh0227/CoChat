import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";

const ChatListScreen = (props) => {
  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => props.navigation.navigate("NewChat")}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="create-outline" size={24} color={colors.blue} />
        </Pressable>
      ),
    });
  }, [props.navigation]);

  return (
    <View style={styles.container}>
      <Text>Chat list screen</Text>
      <Button
        title="Go to chat screen"
        onPress={() => props.navigation.navigate("ChatScreen")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatListScreen;
