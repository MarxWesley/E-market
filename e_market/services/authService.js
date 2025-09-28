// src/services/authService.js
import axios from "axios";
import { Platform } from "react-native";

// Ajuste aqui para o IP da sua máquina na rede local
// Exemplo: "http://192.168.0.15:3000"
const LOCAL_IP = "http://192.168.0.15:3000";

const API_URL =
  Platform.OS === "web"
    ? "http://localhost:3000/users" // roda no navegador do PC
    : `${LOCAL_IP}/users`;          // roda no celular/emulador

const login = async (email, senha) => {
  try {
    const response = await axios.get(API_URL, {
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
