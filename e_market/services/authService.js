// src/services/authService.js
import axios from "axios";

const API_URL = "http://localhost:3000/users";

export const login = async (email, senha) => {

    const response = await axios.get(`${API_URL}?email=${email}&senha=${senha}`);

    if (response.data.length > 0) {
        const user = response.data[0];
        // gera um token fake só para simular
        return { ...user, token: "fake-jwt-token-" + user.id };
    } else {
        throw new Error("Credenciais inválidas");
    }
};