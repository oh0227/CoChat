import axios from "axios";
import { BASE_URL } from "../../constants/base_url"; // ex. http://localhost:8000

export const createChat = async (loggedInUserId, chatData, token) => {
  const newChatData = {
    ...chatData,
    createdBy: loggedInUserId,
    updatedBy: loggedInUserId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const response = await axios.post(`${BASE_URL}/chats/`, newChatData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.chat_id; // 백엔드가 chat_id 리턴한다고 가정
  } catch (error) {
    console.error("createChat error:", error.response?.data || error.message);
    throw error;
  }
};

export const sendTextMessage = async (chatId, senderId, messageText, token) => {
  const messageData = {
    sender_id: senderId,
    text: messageText,
  };

  try {
    await axios.post(`${BASE_URL}/chats/${chatId}/send`, messageData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(
      "sendTextMessage error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

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

export const fetchData = async (cochat_id) => {
  try {
    const res = await axios.get(`${BASE_URL}/message/cochat_id/${cochat_id}`);

    dispatch(setMessageData({ messageData: res.data }));
  } catch (error) {
    console.error("데이터 로딩 실패:", error.response?.data || error.message);
  } finally {
    setIsLoading(false);
  }
};
