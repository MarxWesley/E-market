// store/features/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, senha }, { rejectWithValue }) => {
    try {
      return await authService.login(email, senha);
    } catch (error) {
      return rejectWithValue(error.message); // <-- era rejectWhiteValue
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null, loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Falha no login";
      });
  },
});

export const { logout } = authSlice.actions;
export const authReducer =  authSlice.reducer; // <-- export default facilita no store
