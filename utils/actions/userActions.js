import axios from "axios";
import BASE_URL from "../../constants/base_url";

export const getUserData = async (userId, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "유저 데이터 조회 실패:",
      error.response?.data || error.message
    );
    return null;
  }
};

export const searchUsers = async (queryText, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const allUsers = response.data;
    const lowerQuery = queryText.toLowerCase();

    const filtered = allUsers.filter((user) =>
      (user.first_name + user.last_name).toLowerCase().includes(lowerQuery)
    );

    return filtered;
  } catch (error) {
    console.error("유저 검색 실패:", error.response?.data || error.message);
    return [];
  }
};

export const updateUserPreference = async (messageId, cochatId) => {
  try {
    console.log("🔁 updateUserPreference called");
    const response = await axios.post(`${BASE_URL}/user/preference/update`, {
      message_id: messageId,
      cochat_id: cochatId,
    });

    if (response.status === 200) {
      console.log("✅ 취향 업데이트 완료");
      return { success: true, data: response.data };
    } else {
      console.warn("⚠️ 예상치 못한 응답:", response.status);
      return { success: false, status: response.status };
    }
  } catch (error) {
    console.error("❌ 취향 업데이트 실패:", error);
    return { success: false, error };
  }
};
