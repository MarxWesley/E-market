// store/features/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authService from "../../services/authService";

/**
 * Login do usuário
 * Esperado de authService.login:
 *  - { token, user }   OU
 *  - { token, name, email, ... }
 * Normalizamos para { token, user } e persistimos no AsyncStorage.
 */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, senha }, { rejectWithValue }) => {
    try {
      const res = await authService.login(email, senha);

      // Separa token e possível user embutido
      const { token, user: rawUser, ...rest } = res || {};
      const baseUser = rawUser ?? rest ?? {};

      // Normaliza nome (aceita várias chaves comuns)
      const normalizedName =
        baseUser.name ??
        baseUser.nome ??
        baseUser.fullName ??
        baseUser.fullname ??
        baseUser.full_name ??
        null;

      // Normaliza email (fallback para o email usado no form)
      const normalizedEmail = baseUser.email ?? email ?? null;

      // Normaliza avatar
      const normalizedAvatar =
        baseUser.avatarUrl ?? baseUser.avatar ?? baseUser.photoUrl ?? null;

      // Monta user final (mantém demais props, mas padroniza name/email/avatarUrl)
      const user = {
        ...baseUser,
        id: baseUser.id ?? baseUser._id ?? baseUser.userId ?? baseUser.uid ?? null,
        name: normalizedName,
        email: normalizedEmail,
        avatarUrl: normalizedAvatar,
      };

      // Persistência
      await AsyncStorage.multiSet([
        ["@token", token ?? ""],
        ["@user", JSON.stringify(user)],
      ]);

      return { token, user };
    } catch (error) {
      return rejectWithValue(error?.message || "Falha no login");
    }
  }
);

/** Hidrata sessão do AsyncStorage (usar no início do app). */
export const hydrateSession = createAsyncThunk(
  "auth/hydrateSession",
  async () => {
    const [[, token], [, userStr]] = await AsyncStorage.multiGet(["@token", "@user"]);
    const user = userStr ? JSON.parse(userStr) : null;
    if (!token) return { token: null, user: null };
    return { token, user };
  }
);

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
    /** Define credenciais manualmente (útil após cadastro) */
    setCredentials: (state, action) => {
      state.token = action.payload?.token ?? null;
      state.user = action.payload?.user ?? null;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      // limpa armazenamento (sem await porque reducer é síncrono)
      AsyncStorage.multiRemove(["@token", "@user", "@refreshToken"]).catch(() => {});
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user ?? null;
        state.token = action.payload.token ?? null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Falha no login";
      })

      // hidratação
      .addCase(hydrateSession.fulfilled, (state, action) => {
        state.user = action.payload.user ?? null;
        state.token = action.payload.token ?? null;
      })
      .addCase(hydrateSession.rejected, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { setCredentials, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
