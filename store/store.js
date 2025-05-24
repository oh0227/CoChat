import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import userSlice from "./userSlice";
import messageSlice from "./messageSlice";
import messengerSlice from "./messengerSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    users: userSlice,
    messages: messageSlice,
    messengers: messengerSlice,
  },
});
