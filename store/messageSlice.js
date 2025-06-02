import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messageData: [],
  },
  reducers: {
    // 기존 서버에서 받아오는 초기 메시지 추가
    setMessageData: (state, action) => {
      const newMessages = action.payload.messageData;
      const existingIds = new Set(state.messageData.map((msg) => msg.id));

      const uniqueMessages = newMessages.filter(
        (msg) => !existingIds.has(msg.id)
      );

      state.messageData = [...state.messageData, ...uniqueMessages];
    },

    // FCM 실시간 메시지 추가
    addMessage: (state, action) => {
      const newMsg = action.payload;
      const exists = state.messageData.some((msg) => msg.id === newMsg.id);
      if (!exists) {
        state.messageData.push(newMsg);
      }
    },

    // (선택) 메시지 전부 초기화할 수 있는 리듀서
    resetMessages: (state) => {
      state.messageData = [];
    },
  },
});

export const { setMessageData, addMessage, resetMessages } =
  messageSlice.actions;

export default messageSlice.reducer;
