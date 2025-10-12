import api from "./api";

const getFavoriteByUserId = async (userId) => {
  try {
    const response = await api.get(`/favorites?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching favorite items:", error);
    throw error;
  }
};

const addFavorite = async (favorite) => {
  const response = await api.post(`/favorites`, favorite);
  return response.data;
};

const removeFavorite = async (id) => {
  const response = await api.delete(`/favorites/${id}`);
  return response.data;
};

export default {
  getFavoriteByUserId,
  addFavorite,
  removeFavorite,
};