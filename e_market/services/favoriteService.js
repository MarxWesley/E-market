import api from "./api";

const getFavoriteByUserId = async (userId) => {
  try {
    const response = await api.get(`/favorites/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching favorite items:", error);
    throw error;
  }
};

const addFavorite = async ({ id, userId, productId }) => {
  const response = await api.post(`/favorites`, { id, userId, productId });
  return response.data;
};

const removeFavorite = async ({userId, productId }) => {
  const res = await api.get(
    `/favorites?userId=${userId}&productId=${productId}`
  );
  if (res.data.length > 0) {
    await api.delete(`/favorites/${res.data[0].id}`);
    return res.data[0].id;
  }
  return null;
};

export default {
  getFavoriteByUserId,
  addFavorite,
  removeFavorite,
};
