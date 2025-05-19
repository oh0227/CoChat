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

const SAMPLE_DATA = [
  {
    service: "Gmail",
    icon: "mail",
    color: "#ea4335",
    accounts: ["test1@gmail.com", "test2@gmail.com", "test3@gmail.com"],
  },
  {
    service: "Facebook Messenger",
    icon: "logo-facebook",
    color: "#1877f2",
    accounts: ["username1", "username2"],
  },
];

const AccountSetupScreen = (props) => {
  const [selectedAccounts, setSelectedAccounts] = useState(() => {
    const init = {};
    SAMPLE_DATA.forEach((s) => {
      init[s.service] = {};
      s.accounts.forEach((a) => (init[s.service][a] = true));
    });
    return init;
  });

  useEffect(() => {
    {
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
    }
  }, [props.navigation]);

  const toggleAccount = (service, account) => {
    setSelectedAccounts((prev) => ({
      ...prev,
      [service]: {
        ...prev[service],
        [account]: !prev[service][account],
      },
    }));
  };

  const handleContinue = () => {
    // TODO: API 호출 등
    props.navigation.navigate("NoticeType");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Co-Chat successfully{"\n"}found your accounts!
      </Text>

      <ScrollView style={styles.scroll}>
        {SAMPLE_DATA.map((section) => (
          <View key={section.service} style={styles.serviceBox}>
            <View style={styles.serviceHeader}>
              <Icon name={section.icon} size={22} color={section.color} />
              <Text style={styles.serviceTitle}>
                {section.service.toUpperCase()}
              </Text>
            </View>

            {section.accounts.map((acc) => (
              <TouchableOpacity
                key={acc}
                style={styles.accountRow}
                onPress={() => toggleAccount(section.service, acc)}
              >
                <Icon
                  name={
                    selectedAccounts[section.service][acc]
                      ? "checkbox"
                      : "square-outline"
                  }
                  size={20}
                  color="#333"
                />
                <Text style={styles.accountText}>{acc.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>
                You have{" "}
                <Text style={styles.highlight}>{section.accounts.length}</Text>{" "}
                accounts in{" "}
                <Text style={styles.highlight}>{section.service}!</Text>
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
  serviceBox: {
    backgroundColor: "#f1f1f1",
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceTitle: {
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
