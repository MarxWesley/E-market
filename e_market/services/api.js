import axios from "axios";
import { Platform } from "react-native";

const LOCAL_IP = "http://192.168.3.108:3000";

const BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:3000" // roda no navegador do PC
    : `${LOCAL_IP}`;          // roda no celular/emulador

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 2000,
  headers: {
    "Content-Type": "application/json",
  }
});

export default api;