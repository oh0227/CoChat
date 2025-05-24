import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { MESSENGERS } from "../constants/messengers";
import { useSelector } from "react-redux";
import BASE_URL from "../constants/base_url";
import axios from "axios";
import messaging from "@react-native-firebase/messaging";

const MessengerSetupScreen = (props) => {
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    props.navigation.setOptions({ headerTitle: "Messenger Selection" });
  }, []);

  // 메신저별 로그인 버튼 클릭 시
  const handleMessengerLogin = async (messengerId) => {
    try {
      // OAuth 로그인 페이지 열기
      const loginUrl = `${BASE_URL}/${messengerId}/auth/login?cochat_id=${userData.cochat_id}`;
      await Linking.openURL(loginUrl);

      // 로그인 후 연결된 메신저 계정 정보 받아오기
      const { data } = await axios.get(
        `${BASE_URL}/messenger/cochat_id/${userData.cochat_id}`
      );

      // 새로운 계정 목록 변환
      const newAccounts = data.map((item) => ({
        messenger_name: item.messenger,
        messenger_user_id: item.messenger_user_id,
        access_token: item.access_token,
      }));

      // 기존 connectedAccounts에 없는 계정만 필터링
      const uniqueNewAccounts = newAccounts.filter((newItem) => {
        return !connectedAccounts.some(
          (existingItem) =>
            existingItem.messenger_name === newItem.messenger_name &&
            existingItem.messenger_user_id === newItem.messenger_user_id
        );
      });

      // 병합 후 상태 업데이트
      const updatedAccounts = [...connectedAccounts, ...uniqueNewAccounts];
      setConnectedAccounts(updatedAccounts);
    } catch (err) {
      console.error("메신저 로그인 오류:", err);
    }
  };

  // 완료 버튼 클릭 시
  const handleComplete = () => {
    messaging()
      .getToken()
      .then((token) => {
        return axios.post(`${BASE_URL}/register-fcm-token`, {
          cochat_id: userData.cochat_id,
          fcm_token: token,
        });
      })
      .then((res) => {
        console.log("✅ FCM 토큰 등록 성공", res.data);
      })
      .catch((err) => {
        console.error("❌ FCM 등록 실패:", err.response?.data || err.message);
      });

    props.navigation.navigate("AccountSetUp", { connectedAccounts });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Welcome to{"\n"}Co-Chat Messenger{"\n"}Integration Service!
      </Text>
      <Text style={styles.subtitle}>
        Select messengers to connect. You can add multiple accounts per
        messenger.
      </Text>

      <ScrollView style={styles.selectionBox}>
        {MESSENGERS.map((item) => (
          <View key={item.id} style={styles.item}>
            {/* 아이콘 + 라벨 */}
            <View style={styles.itemHeader}>
              <Icon name={item.icon} size={22} color="#444" />
              <Text style={styles.itemText}>{item.label.toUpperCase()}</Text>
            </View>

            {/* 로그인 버튼 */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => handleMessengerLogin(item.id)}
            >
              <Text style={styles.loginButtonText}>LOGIN</Text>
            </TouchableOpacity>

            {/* 계정 목록 */}
            <View style={styles.accountList}>
              {connectedAccounts
                .filter((acc) => acc.messenger_name === item.id)
                .map((acc) => (
                  <Text
                    key={acc.messenger_user_id}
                    style={styles.connectedText}
                  >
                    {acc.messenger_user_id}
                  </Text>
                ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
        <Text style={styles.completeButtonText}>Complete</Text>
        <Icon name="checkmark" size={20} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MessengerSetupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6e7eb3",
    padding: 20,
    justifyContent: "flex-start",
  },
  title: {
    marginTop: 20,
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    color: "#ddd",
    marginTop: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  selectionBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    marginTop: 10,
    flex: 1,
  },
  item: {
    paddingVertical: 12,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  itemText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },

  loginButton: {
    backgroundColor: "#3546f0",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignSelf: "flex-start", // 왼쪽 정렬
    marginBottom: 6,
  },

  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  connectedText: {
    color: "#0a0",
    fontSize: 14,
    marginVertical: 2,
  },

  accountList: {
    paddingLeft: 6,
  },
  completeButton: {
    backgroundColor: "#1abc9c",
    padding: 16,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  completeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
  },
  accountList: {
    marginTop: 8,
    paddingLeft: 8,
  },
  connectedText: {
    color: "#333",
    fontSize: 14,
    marginVertical: 2,
  },
});
