import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  AppState,
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
    fetchConnectedAccounts();

    // AppState로 앱 복귀 시 계정 정보 다시 불러오기
    const appStateListener = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        fetchConnectedAccounts();
      }
    });

    // 딥링크로 돌아왔을 때 처리
    const deepLinkListener = Linking.addEventListener("url", (event) => {
      const url = event.url;
      if (url.includes("messenger-auth")) {
        fetchConnectedAccounts();
      }
    });

    return () => {
      appStateListener.remove();
      deepLinkListener.remove();
    };
  }, []);

  const fetchConnectedAccounts = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/messenger/cochat_id/${userData.cochat_id}`
      );
      const newAccounts = data.map((item) => ({
        messenger_name: item.messenger,
        messenger_user_id: item.messenger_user_id,
        access_token: item.access_token,
      }));
      setConnectedAccounts(newAccounts);
    } catch (err) {
      console.error("계정 목록 불러오기 실패:", err);
    }
  };

  const handleMessengerLogin = async (messengerId) => {
    try {
      const redirectUri = "cochat://messenger-auth"; // ✅ 딥링크 URI

      const loginUrl = `${BASE_URL}/${messengerId}/login?cochat_id=${
        userData.cochat_id
      }&redirect_uri=${encodeURIComponent(redirectUri)}`;
      await Linking.openURL(loginUrl);
    } catch (err) {
      console.error("메신저 로그인 오류:", err);
    }
  };

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
            <View style={styles.itemHeader}>
              <Icon name={item.icon} size={22} color="#444" />
              <Text style={styles.itemText}>{item.label.toUpperCase()}</Text>
            </View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => handleMessengerLogin(item.id)}
            >
              <Text style={styles.loginButtonText}>LOGIN</Text>
            </TouchableOpacity>
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
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
});
