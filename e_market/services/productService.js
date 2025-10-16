import api from "./api";

// Buscar todos os produtos
const getAllProducts = async () => {
    const response = await api.get(`/products`);
    return response.data;
};

// Buscar produto pelo ID
const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

//buscar produtos pelo ID do usuário
const getProductByUserId = async (userId) => {
    const response = await api.get(`/products?userId=${userId}`);
    return response.data;
}

// Buscar produtos pelo título (LIKE ignorando maiúsculas/minúsculas)
const getProductsByTitle = async (title) => {
  const response = await api.get(`/products`);
  return response.data.filter(product =>
    product.title.toLowerCase().includes(title.toLowerCase())
  );
};

// Buscar categorias
const getCategories = async () => {
    const response = await api.get(`/categories`);
    return response.data;
};

// Criar produto
const createProduct = async (productData) => {
    const response = await api.post(`/products`, productData, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;
};

// Editar produto
const updateProduct = async (id, productData) => {
    const response = await api.patch(`/products/${id}`, productData, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;
};

// Excluir produto
const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};

export default {
    getAllProducts,
    getProductById,
    getProductsByTitle,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    getProductByUserId,
}