import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { isSetUp } from "../store/authSlice";
import BASE_URL from "../constants/base_url";
import colors from "../constants/colors";

const DEFAULT_NOTIFICATION_TYPES = [
  { id: "deadline", label: "마감 안내", icon: "calendar" },
  { id: "payment", label: "결제 안내", icon: "card" },
  { id: "public", label: "공공 경고", icon: "warning" },
  { id: "office", label: "행정 공지", icon: "document-text" },
];

const NoticeTypeScreen = (props) => {
  const dispatch = useDispatch();
  const [types, setTypes] = useState(DEFAULT_NOTIFICATION_TYPES);
  const [selected, setSelected] = useState(
    DEFAULT_NOTIFICATION_TYPES.map((n) => n.id)
  );
  const [newTypeLabel, setNewTypeLabel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { cochat_id } = useSelector((state) => state.auth.userData);

  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() => props.navigation.goBack()}
          style={styles.buttonContainer}
        >
          <Text style={styles.button}>뒤로가기</Text>
        </Pressable>
      ),
    });
  }, [props.navigation]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === types.length) {
      setSelected([]);
    } else {
      setSelected(types.map((t) => t.id));
    }
  };

  const addCustomType = () => {
    if (!newTypeLabel.trim()) return;
    const newType = {
      id: newTypeLabel.trim(),
      label: newTypeLabel.trim(),
      icon: "notifications",
    };

    setTypes((prev) => [...prev, newType]);
    setSelected((prev) => [...prev, newType.id]);
    setNewTypeLabel("");
  };

  const handleContinue = async () => {
    try {
      setIsLoading(true);
      const payload = {
        cochat_id: cochat_id, // 실제 유저 ID로 교체
        preferences: selected,
      };

      const response = await fetch(`${BASE_URL}/user/preference/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("서버 전송 실패");

      console.log("✅ Preferences sent!");
      dispatch(isSetUp());
      props.navigation.navigate("Main");
    } catch (error) {
      console.error("❗ Error sending preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAllSelected = selected.length === types.length;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>받고 싶은 알림 유형을 선택해주세요.</Text>

      <View style={styles.selectionBox}>
        <TouchableOpacity style={styles.item} onPress={toggleSelectAll}>
          <Icon
            name={isAllSelected ? "checkbox" : "square-outline"}
            size={22}
            color="#333"
          />
          <Text style={styles.itemText}>전체 선택</Text>
        </TouchableOpacity>

        {types.map((item) => (
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
            <Text style={styles.itemText}>{item.label}</Text>
          </TouchableOpacity>
        ))}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.inputRow}>
            <TextInput
              placeholder="새 알림 유형 추가"
              placeholderTextColor="#999"
              style={styles.input}
              value={newTypeLabel}
              onChangeText={setNewTypeLabel}
              autoCorrect={false} // 자동수정 끄기
              autoCapitalize="none" // 대문자 자동화 끄기
              keyboardType="default" // 기본 키보드 (한글 지원됨)
              importantForAutofill="no"
            />
            <TouchableOpacity onPress={addCustomType} style={styles.addButton}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>추가</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>

      <Text style={styles.note}>
        체크하지 않은 알림은 일반 분류로 표시됩니다.
      </Text>

      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={{ marginTop: 10 }}
        />
      ) : (
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>계속하기</Text>
          <Icon name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      )}
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
    fontSize: 16,
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
  inputRow: {
    flexDirection: "row",
    marginTop: 14,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#3546f0",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
});
