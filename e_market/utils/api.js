// utils/api.js
import axios from "axios";
import { Platform } from "react-native";

const BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:3000"             // web pode usar localhost
    : "http://192.168.0.15:3000";         // <-- troque para o IP da SUA máquina

const api = axios.create({ baseURL: BASE_URL, timeout: 8000 });
export default api;
