// src/services/authService.js
import api from "./api";

const login = async (credentials) => {
  try {
    const { data } = await api.post("/auth/login", credentials);

    return data;
  } catch (error) {
    throw new Error(error.message || "Erro de rede");
  }
};

export default {
  login,
};