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
import { useDispatch } from "react-redux";
import { isSetUp } from "../store/authSlice";

const NOTIFICATION_TYPES = [
  { id: "deadline", label: "Deadline Notice", icon: "calendar" },
  { id: "payment", label: "Payment Notice", icon: "card" },
  { id: "public", label: "Public Warning Notice", icon: "warning" },
  { id: "office", label: "Office Notice", icon: "document-text" },
];

const NoticeTypeScreen = (props) => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(NOTIFICATION_TYPES.map((n) => n.id));

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

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === NOTIFICATION_TYPES.length) {
      setSelected([]);
    } else {
      setSelected(NOTIFICATION_TYPES.map((n) => n.id));
    }
  };

  const handleContinue = () => {
    // TODO: 선택한 항목 저장 처리
    dispatch(isSetUp());
    props.navigation.navigate("Main");
  };

  const isAllSelected = selected.length === NOTIFICATION_TYPES.length;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Select the type of notifications you want to classify.
      </Text>

      <View style={styles.selectionBox}>
        <TouchableOpacity style={styles.item} onPress={toggleSelectAll}>
          <Icon
            name={isAllSelected ? "checkbox" : "square-outline"}
            size={22}
            color="#333"
          />
          <Text style={styles.itemText}>SELECT ALL</Text>
        </TouchableOpacity>

        {NOTIFICATION_TYPES.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.item}
            onPress={() => toggleSelect(item.id)}
          >
            <Icon
              name={selected.includes(item.id) ? "checkbox" : "square-outline"}
              size={22}
              color="#333"
            />
            <Icon
              name={item.icon}
              size={20}
              color="#555"
              style={{ marginLeft: 10 }}
            />
            <Text style={styles.itemText}>{item.label.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.note}>
        Please note that unmarked notifications are displayed at once.
      </Text>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>CONTINUE</Text>
        <Icon name="arrow-forward" size={18} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default NoticeTypeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6e7eb3",
    padding: 20,
  },
  title: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
    marginBottom: 16,
  },
  selectionBox: {
    backgroundColor: "#f1f1f1",
    borderRadius: 14,
    padding: 14,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  itemText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  note: {
    color: "#eee",
    fontSize: 13,
    textAlign: "center",
    marginTop: 20,
  },
  continueButton: {
    backgroundColor: "#3546f0",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  continueText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 8,
    fontSize: 16,
  },
});
