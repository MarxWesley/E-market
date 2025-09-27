import { configureStore } from "@reduxjs/toolkit";
import { tasksReducer } from "./features/taskSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const store = configureStore({
    reducer: {
        tasks: tasksReducer
    }
});

// store.subscribe(() => {
//     console.log('store: ', store.getState().tasks);
//     AsyncStorage.setItem('@TASKS', JSON.stringify(store.getState().tasks));
// });