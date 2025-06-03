import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import BASE_URL from "../constants/base_url";
import { useSelector } from "react-redux";

const AccountSetupScreen = (props) => {
  const { connectedAccounts = [] } = props?.route?.params || {};

  const [selectedAccounts, setSelectedAccounts] = useState({});
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    // 계정 초기 선택 상태 설정
    const init = {};
    connectedAccounts.forEach((acc) => {
      const { messenger_name, messenger_user_id } = acc;
      if (!init[messenger_name]) init[messenger_name] = {};
      init[messenger_name][messenger_user_id] = true;
    });
    setSelectedAccounts(init);
  }, [connectedAccounts]);

  const groupedAccounts = connectedAccounts.reduce((acc, curr) => {
    const name = curr.messenger_name;
    if (!acc[name]) acc[name] = [];
    if (!acc[name].includes(curr.messenger_user_id)) {
      acc[name].push(curr.messenger_user_id);
    }
    return acc;
  }, {});

  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() => props.navigation.goBack()}
          style={styles.buttonContainer}
        >
          <Text style={styles.button}>Back</Text>
        </Pressable>
      ),
    });
  }, [props.navigation]);

  const toggleAccount = (messenger, account) => {
    setSelectedAccounts((prev) => ({
      ...prev,
      [messenger]: {
        ...prev[messenger],
        [account]: !prev[messenger]?.[account],
      },
    }));
  };

  const handleContinue = async () => {
    try {
      // 삭제할 계정 추출
      const accountsToDelete = [];

      Object.entries(selectedAccounts).forEach(([messenger, accountMap]) => {
        Object.entries(accountMap).forEach(([accountId, isSelected]) => {
          if (!isSelected) {
            accountsToDelete.push({
              messenger,
              messenger_user_id: accountId,
            });
          }
        });
      });

      // 삭제 요청 수행 (병렬 처리)
      await Promise.all(
        accountsToDelete.map((acc) =>
          axios.request({
            method: "delete",
            url: `${BASE_URL}/messenger/delete`,
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              user_id: userData.cochat_id,
              messenger: acc.messenger,
              messenger_user_id: acc.messenger_user_id,
            },
          })
        )
      );

      console.log("✅ 선택 해제된 계정 삭제 완료");
    } catch (err) {
      console.error("❌ 계정 삭제 중 오류:", err.response?.data || err.message);
    }

    // 다음 화면 이동
    props.navigation.navigate("NoticeType");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Co-Chat successfully{"\n"}connect your accounts!
      </Text>

      <ScrollView style={styles.scroll}>
        {groupedAccounts &&
          Object.entries(groupedAccounts).map(([messenger, accounts]) => (
            <View key={messenger} style={styles.messengerBox}>
              <View style={styles.messengerHeader}>
                <Text style={styles.messengerTitle}>
                  {messenger.toUpperCase()}
                </Text>
              </View>

              {accounts.map((acc) => (
                <TouchableOpacity
                  key={acc}
                  style={styles.accountRow}
                  onPress={() => toggleAccount(messenger, acc)}
                >
                  <Icon
                    name={
                      selectedAccounts[messenger]?.[acc]
                        ? "checkbox"
                        : "square-outline"
                    }
                    size={20}
                    color="#333"
                  />
                  <Text style={styles.accountText}>{acc}</Text>
                </TouchableOpacity>
              ))}

              <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>
                  You have{" "}
                  <Text style={styles.highlight}>{accounts.length}</Text>{" "}
                  accounts in <Text style={styles.highlight}>{messenger}!</Text>
                </Text>
              </View>
            </View>
          ))}
      </ScrollView>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>CONTINUE</Text>
        <Icon name="arrow-forward" size={18} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AccountSetupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6e7eb3",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    lineHeight: 30,
  },
  scroll: {
    flex: 1,
  },
  messengerBox: {
    backgroundColor: "#f1f1f1",
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
  },
  messengerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  messengerTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  accountText: {
    marginLeft: 10,
    fontSize: 14,
  },
  summaryBox: {
    backgroundColor: "#dde3f5",
    padding: 8,
    borderRadius: 10,
    marginTop: 12,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: "500",
  },
  highlight: {
    color: "#3546f0",
    fontWeight: "bold",
  },
  continueButton: {
    backgroundColor: "#3546f0",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  continueText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 8,
    fontSize: 16,
  },
});
