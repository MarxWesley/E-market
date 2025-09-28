// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import { tasksReducer } from "./features/taskSlice";
import authReducer from "./features/authSlice"; // ⬅ default

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    auth: authReducer, // ⬅ registra o auth
  },
});
