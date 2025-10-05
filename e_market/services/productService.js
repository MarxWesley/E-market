import axios from "axios";

const API_URL = "http://localhost:3000";

// Buscar todos os produtos
const getAllProducts = async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
};

// Buscar produto pelo ID
const getProductById = async (id) => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
};

// Buscar produto pelo nome
const getProductsByTitle = async (title) => {
    const response = await axios.get(`${API_URL}/products?title=${title}`);
    return response.data;
};

// Buscar categorias
const getCategories = async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
};

// Criar produto
const createProduct = async (productData) => {
    const response = await axios.post(`${API_URL}/products`, productData, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;
};

// Editar produto
const updateProduct = async (id, productData) => {
    const response = await axios.put(`${API_URL}/products/${id}`, productData, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;
};

// Excluir produto
const deleteProduct = async (id) => {
    const response = await axios.delete(`${API_URL}/products/${id}`);
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
}