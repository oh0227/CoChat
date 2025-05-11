import React, { useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import PageContainer from "../components/PageContainer";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import colors from "../constants/colors";

const NewChatScreen = (props) => {
  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() => props.navigation.goBack()}
          style={{ marginLeft: 16 }} // 필요시 여백 조정
        >
          <FontAwesome name="close" size={23} color={colors.blue} />
        </Pressable>
      ),
      headerTitle: "New Chat",
    });
  }, [props.navigation]);

  return (
    <PageContainer>
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={15} color={colors.lightGrey} />
        <TextInput
          placeholder="Search"
          style={styles.searchBox}
          onChangeText={() => {}}
        />
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.extraLightGrey,
    height: 30,
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  searchBox: {
    marginLeft: 8,
    fontSize: 15,
    width: "100%",
  },
});

export default NewChatScreen;
