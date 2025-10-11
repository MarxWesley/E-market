// src/services/authService.js
import api from "./api";

const login = async (email, senha) => {
  try {
    const response = await api.get("/users", {
      params: { email, senha },
    });

    if (response.data.length > 0) {
      const user = response.data[0];
      // token fake só para simulação
      return { ...user, token: "fake-jwt-token-" + user.id };
    } else {
      throw new Error("Credenciais inválidas");
    }
  } catch (error) {
    throw new Error(error.message || "Erro de rede");
  }
};

export default {
  login,
};