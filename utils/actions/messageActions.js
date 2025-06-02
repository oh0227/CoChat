import axios from "axios";
import BASE_URL from "../../constants/base_url";
import { setMessageData } from "../../store/messageSlice";

export const starMessage = async (messageId, chatId, userId, token) => {
  try {
    await axios.post(
      `${BASE_URL}/messages/${chatId}/${messageId}/star`,
      { user_id: userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("starMessage error:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchData = (cochat_id) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(`${BASE_URL}/message/cochat_id/${cochat_id}`);

      // 메시지가 아예 없을 수도 있음
      if (!res.data || res.data.length === 0) {
        console.log("메시지가 없습니다.");
        dispatch(setMessageData({ messageData: [] }));
        return;
      }

      dispatch(setMessageData({ messageData: res.data }));
    } catch (error) {
      // 진짜 네트워크 에러 등만 출력
      if (error.message === "Network Error") {
        console.error("네트워크 오류:", error.message);
      } else {
        console.warn("메시지를 가져오지 못했습니다. (비어있을 수 있음)");
      }
    }
  };
};
