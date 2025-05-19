import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

const MESSENGERS = [
  { id: "instagram", label: "Instagram DM" },
  { id: "facebook", label: "Facebook Messenger" },
  { id: "gmail", label: "Gmail" },
  { id: "sms", label: "SMS" },
];

const MessengerSetupScreen = (props) => {
  const [selected, setSelected] = useState(MESSENGERS.map((m) => m.id));

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: "Messenger Selection",
    });
  }, [props.navigation]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === MESSENGERS.length) {
      setSelected([]);
    } else {
      setSelected(MESSENGERS.map((m) => m.id));
    }
  };

  const handleContinue = () => {
    // 설정 저장 (예: Redux)
    props.navigation.navigate("AccountSetUp");
  };

  const isAllSelected = selected.length === MESSENGERS.length;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Welcome to{"\n"}Co-Chat Messenger{"\n"}Integration Service!
      </Text>
      <Text style={styles.subtitle}>
        Select messengers that you want to manage.
      </Text>

      <View style={styles.selectionBox}>
        <TouchableOpacity style={styles.item} onPress={toggleSelectAll}>
          <Icon
            name={isAllSelected ? "checkbox" : "square-outline"}
            size={22}
            color="#444"
          />
          <Text style={styles.itemText}>SELECT ALL</Text>
        </TouchableOpacity>

        {MESSENGERS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.item}
            onPress={() => toggleSelect(item.id)}
          >
            <Icon
              name={selected.includes(item.id) ? "checkbox" : "square-outline"}
              size={22}
              color="#444"
            />
            <Text style={styles.itemText}>{item.label.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>CONTINUE</Text>
        <Icon name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MessengerSetupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6e7eb3", // 대략적인 보라-블루 배경
    padding: 20,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
    fontSize: 12,
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
  },
  selectionBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  itemText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "500",
  },
  continueButton: {
    backgroundColor: "#3546f0",
    padding: 16,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
  },
  button: {
    color: "black",
  },
  buttonContainer: {
    marginLeft: 16,
    width: 50,
  },
});
