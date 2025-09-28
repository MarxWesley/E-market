// src/services/userService.js
import axios from "axios";
import { Platform } from "react-native";

const LOCAL_IP = "http://192.168.0.15:3000"; // ⚠️ troque pelo IP da sua máquina
const API_URL = Platform.OS === "web" ? "http://localhost:3000/users" : `${LOCAL_IP}/users`;

const getUsers = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

const getUserById = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

const createUser = async (user) => {
  const { data } = await axios.post(API_URL, user);
  return data;
};

const updateUser = async (id, user) => {
  const { data } = await axios.put(`${API_URL}/${id}`, user);
  return data;
};

const deleteUser = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
