import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authService from "../../services/authService";

/**
 * LOGIN USER
 * Espera backend NestJS com endpoint POST /auth/login
 * Exemplo de resposta esperada:
 * {
 *   "access_token": "jwt-token",
 *   "user": { "id": 1, "name": "Wesley", "email": "wesley@email.com" }
 * }
 */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await authService.login(credentials);

      // 💡 Padroniza possíveis chaves retornadas
      const token = res?.access_token || res?.token || res?.jwt || null;
      const user = res?.user || res?.data?.user || res?.usuario || {};

      if (!token) throw new Error("Token não recebido do servidor");

      // 🔒 Salva sessão
      await AsyncStorage.multiSet([
        ["@token", token],
        ["@user", JSON.stringify(user)],
      ]);

      return { token, user };
    } catch (error) {
      console.error("Erro loginUser:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Falha no login"
      );
    }
  }
);

/**
 * HIDRATAR SESSÃO (AsyncStorage)
 * Recarrega user/token do armazenamento local no início do app
 */
export const hydrateSession = createAsyncThunk(
  "auth/hydrateSession",
  async () => {
    const [[, token], [, userStr]] = await AsyncStorage.multiGet([
      "@token",
      "@user",
    ]);
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  }
);

/**
 * LOGOUT (limpa AsyncStorage e estado)
 */
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await AsyncStorage.multiRemove(["@token", "@user"]);
  return true;
});

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Falha no login";
      })

      // HIDRATAR
      .addCase(hydrateSession.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;