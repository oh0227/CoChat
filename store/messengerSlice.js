import { createSlice } from "@reduxjs/toolkit";

const messegerSlice = createSlice({
  name: "messengers",
  initialState: {
    selectedMessengers: [],
  },
  reducers: {
    setMessengers: (state, action) => {
      state.selectedMessengers = [...action.payload.selectedMessengers];
    },
  },
});

export const setMessengers = messegerSlice.actions.setMessengers;
export default messegerSlice.reducer;
