import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./features/authSlice";
import { userReducer } from "./features/userSlice";
import { productReducer } from "./features/productSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: userReducer,
        products: productReducer,
    }
});