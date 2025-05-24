import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messageData: [],
  },
  reducers: {
    setMessageData: (state, action) => {
      state.messageData = [...state.messageData, ...action.payload.messageData];
    },
  },
});

export const setMessageData = messageSlice.actions.setMessageData;
export default messageSlice.reducer;
