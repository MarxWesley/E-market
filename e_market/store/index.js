// store/index.js
import { configureStore } from "@reduxjs/toolkit";

// Importa o default export do authSlice
import auth from "./features/authSlice";

// Esses continuam nomeados, se eles exportam algo como `export const userReducer = ...`
import { userReducer } from "./features/userSlice";
import { productReducer } from "./features/productSlice";
import { favoriteReducer } from "./features/favoriteSlice";

export const store = configureStore({
  reducer: {
    auth, // agora o slice "auth" é reconhecido corretamente
    users: userReducer,
    products: productReducer,
    favorites: favoriteReducer,
  },
});
