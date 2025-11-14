import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

// ==========================
// Helper para pegar headers com token
// ==========================
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("@token");
  if (!token) throw new Error("Token não encontrado");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ==========================
// PRODUTOS
// ==========================

// Buscar todos os produtos
const getAllProducts = async () => {
  const headers = await getAuthHeaders();
  const response = await api.get("/items", { headers });
  return response.data;
};

// Buscar produto pelo ID
const getProductById = async (id) => {
  const headers = await getAuthHeaders();
  const response = await api.get(`/items/${id}`, { headers });
  return response.data;
};

// Buscar produtos pelo usuário
const getProductByUserId = async (userId) => {
  const headers = await getAuthHeaders();
  const response = await api.get(`/items?userId=${userId}`, { headers });
  return response.data;
};

// Buscar produtos pelo tipo (LIKE)
const getProductsByTitle = async (title) => {
  const headers = await getAuthHeaders();
  const response = await api.get(`/items?title=${title}`, { headers });
  return response.data;
};

// Criar produto
const createProduct = async (productData) => {
  const headers = await getAuthHeaders();
  const response = await api.post("/items/product", productData, { headers });
  return response.data;
};

// Editar produto
const updateProduct = async (id, productData) => {
  const headers = await getAuthHeaders();
  const response = await api.patch(`/items/product/${id}`, productData, {
    headers,
  });
  return response.data;
};

// Excluir produto
const deleteProduct = async (id) => {
  const headers = await getAuthHeaders();
  const response = await api.delete(`/items/product/${id}`, { headers });
  return response.data;
};

// ==========================
// VEÍCULOS
// ==========================

// Criar veículo
const createVehicle = async (vehicleData) => {
  const headers = await getAuthHeaders();
  const response = await api.post("/items/vehicle", vehicleData, { headers });
  return response.data;
};

// Editar veículo
const updateVehicle = async (id, vehicleData) => {
  const headers = await getAuthHeaders();
  const response = await api.patch(`/items/vehicle/${id}`, vehicleData, {
    headers,
  });
  return response.data;
};

// Excluir veículo
const deleteVehicle = async (id) => {
  const headers = await getAuthHeaders();
  const response = await api.delete(`/items/vehicle/${id}`, { headers });
  return response.data;
};

// Alterar status do item
const changeStatus = async (id) => {
  const headers = await getAuthHeaders();
  // PATCH sem body: passar null como segundo argumento
  const response = await api.patch(`/items/${id}/status`, null, { headers });
  return response.data;
};

// ==========================
// EXPORT
// ==========================
export default {
  getAllProducts,
  getProductById,
  getProductsByTitle,
  getProductByUserId,
  createProduct,
  updateProduct,
  deleteProduct,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  changeStatus,
};
