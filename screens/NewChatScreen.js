import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  FlatList,
} from "react-native";
import PageContainer from "../components/PageContainer";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import colors from "../constants/colors";
import commonStyles from "../constants/commonStyles";
import { searchUsers } from "../utils/actions/userActions";
import DataItem from "../components/DataItem";

const NewChatScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState();
  const [noResultFound, setNoResultFound] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() => props.navigation.goBack()}
          style={styles.buttonContainer}
        >
          <Text style={styles.button}>Close</Text>
        </Pressable>
      ),
      headerTitle: "New chat",
    });
  }, [props.navigation]);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (!searchTerm || searchTerm === "") {
        setUsers();
        setNoResultFound(false);
        return;
      }

      setIsLoading(true);

      const usersResult = await searchUsers(searchTerm);
      setUsers(usersResult);

      if (Object.keys(usersResult).length === 0) {
        setNoResultFound(true);
      } else {
        setNoResultFound(false);
      }

      setIsLoading(false);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  return (
    <PageContainer>
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={15} color={colors.lightGrey} />
        <TextInput
          placeholder="Search"
          style={styles.searchBox}
          onChangeText={(text) => {
            setSearchTerm(text);
          }}
        />
      </View>

      {isLoading && (
        <View stlye={commonStyles.center}>
          <ActivityIndicator size={"large"} color={colors.primary} />
        </View>
      )}

      {!isLoading && !noResultFound && users && (
        <FlatList
          data={Object.keys(users)}
          renderItem={(itemData) => {
            const userId = itemData.item;
            const userData = users[userId];

            return (
              <DataItem
                title={`${userData.firstName} ${userData.lastName}`}
                subTitle={userData.about}
                image={userData.profilePicture}
              />
            );
          }}
        />
      )}

      {!isLoading && noResultFound && (
        <View style={commonStyles.center}>
          <FontAwesome
            name="question"
            size={55}
            color={colors.lightGrey}
            style={styles.noResultIcon}
          />
          <Text style={styles.noResultText}>No users found!</Text>
        </View>
      )}

      {!isLoading && !users && (
        <View style={commonStyles.center}>
          <FontAwesome
            name="users"
            size={55}
            color={colors.lightGrey}
            style={styles.noResultIcon}
          />
          <Text style={styles.noResultText}>
            Enter a name to search for a user!
          </Text>
        </View>
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.extraLightGrey,
    height: 30,
    marginBottom: 8,
    marginTop: -14,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  searchBox: {
    marginLeft: 8,
    fontSize: 15,
    width: "100%",
  },
  buttonContainer: {
    marginLeft: 16,
    width: 50,
  },
  button: {
    fontSize: 15,
    color: colors.blue,
  },
  noResultIcon: {
    marginBottom: 20,
  },
  noResultText: {
    color: colors.textColor,
    fontFamily: "regular",
    letterSpacing: 0.3,
  },
});

export default NewChatScreen;
