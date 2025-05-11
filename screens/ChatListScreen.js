import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Pressable,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import { useSelector } from "react-redux";
import DataItem from "../components/DataItem";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";

const ChatListScreen = (props) => {
  const selectedUser = props.route?.params?.selectedUserId;
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const userChats = useSelector((state) => {
    const chatsData = state.chats.chatsData;
    return Object.values(chatsData).sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  });

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

  useEffect(() => {
    if (!selectedUser) {
      return;
    }

    const chatUsers = [selectedUser, userData.userId];

    const navigationProps = {
      newChatData: { users: chatUsers },
    };

    props.navigation.navigate("ChatScreen", navigationProps);
  }, [props.route?.params]);

  return (
    <PageContainer>
      <PageTitle text="Chats" />
      <FlatList
        data={userChats}
        renderItem={(itemData) => {
          const chatData = itemData.item;
          const chatId = chatData.key;

          const otherUserId = chatData.users.find(
            (uid) => uid !== userData.userId
          );
          const otherUser = storedUsers[otherUserId];

          if (!otherUser) return;

          const title = `${otherUser.firstName} ${otherUser.lastName}`;
          const subTitle = "This will be a message...";
          const image = otherUser.profilePicture;

          return (
            <DataItem
              title={title}
              subTitle={subTitle}
              image={image}
              onPress={() =>
                props.navigation.navigate("ChatScreen", { chatId })
              }
            />
          );
        }}
      />
    </PageContainer>
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
