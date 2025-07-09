import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import axios from "axios";

interface UserState {
  data: any;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  data: null,
  status: "idle",
  error: "",
};

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  console.log("UserSlice API calls");

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/user/me`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null; // Handle undefined case
        // signOut();
      });
  },
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;
