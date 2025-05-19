import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import axios from "axios";
import BASE_URL from "../constants/base_url"; // 예: http://localhost:8000

export const launchImagePicker = async () => {
  await checkMediaPermissions();

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
};

export const uploadImageAsync = async (uri, token) => {
  const formData = new FormData();
  const filename = uri.split("/").pop();
  const match = /\.(\w+)$/.exec(filename ?? "");
  const type = match ? `image/${match[1]}` : `image`;

  formData.append("file", {
    uri,
    name: filename,
    type,
  });

  try {
    const response = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // 필요 시
      },
    });

    return response.data.url; // 백엔드에서 반환하는 이미지 URL
  } catch (error) {
    console.error("이미지 업로드 실패:", error.response?.data || error.message);
    throw error;
  }
};

const checkMediaPermissions = async () => {
  if (Platform.OS !== "web") {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      return Promise.reject("We need permission to access your photos");
    }
  }

  return Promise.resolve();
};
