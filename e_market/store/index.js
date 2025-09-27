import { configureStore } from "@reduxjs/toolkit";
import { tasksReducer } from "./features/taskSlice";
import { authReducer } from "./features/authSlice";
import { userReducer } from "./features/userSlice";

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        auth: authReducer,
        users: userReducer,
    }
});