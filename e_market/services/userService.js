// src/services/userService.js
import api from "./api";

const getUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

const getUserById = async (id) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

const createUser = async (user) => {
  const { data } = await api.post('/users', user);
  return data;
};

const updateUser = async (id, user) => {
  const { data } = await api.put(`/users/${id}`, user);
  return data;
};

const deleteUser = async (id) => {
  await api.delete(`/users/${id}`);
  return id;
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
