// src/services/userService.js
import api from "./api";

/**
 * Retorna lista completa de usuários.
 */
const getUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

/**
 * Retorna um usuário específico pelo ID.
 */
const getUserById = async (id) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

/**
 * Cria um novo usuário.
 */
const createUser = async (user) => {
  const { data } = await api.post("/users", user);
  return data;
};

/**
 * Atualiza dados do usuário (nome, email, etc.).
 */
const updateUser = async (id, user) => {
  const { data } = await api.put(`/users/${id}`, user);
  return data;
};

/**
 * Deleta um usuário existente.
 */
const deleteUser = async (id) => {
  await api.delete(`/users/${id}`);
  return id;
};

/**
 * Atualiza a senha via /users/:id.
 * Altere o campo "password" caso o backend use outro nome (ex: "senha").
 */
const updatePasswordById = async (id, { newPassword }) => {
  const { data } = await api.put(`/users/${id}`, { password: newPassword });
  return data;
};

/**
 * Métodos placeholders — usados apenas para evitar erro 404
 * se o backend não tiver endpoints /users/me.
 */
const getProfile = async () => {
  throw new Error("Endpoint /users/me não disponível. Use getUserById(id).");
};

const updateProfile = async () => {
  throw new Error("Endpoint /users/me não disponível. Use updateUser(id).");
};

const updatePassword = async () => {
  throw new Error("Endpoint /users/me/password não disponível. Use updatePasswordById(id).");
};

/**
 * Retorna estatísticas simuladas para não quebrar a AccountScreen.
 */
const getStats = async () => {
  return { listings: 0, sold: 0, favorites: 0 };
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updatePasswordById,
  getProfile,
  updateProfile,
  updatePassword,
  getStats,
};
