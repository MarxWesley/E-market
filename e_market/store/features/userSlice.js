import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";

// Thunks assíncronos
export const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
    return await userService.getUsers();
});

export const addUser = createAsyncThunk("users/add", async (user) => {
    return await userService.createUser(user);
});

export const editUser = createAsyncThunk("users/edit", async ({ id, data }) => {
    return await userService.updateUser(id, data);
});

export const removeUser = createAsyncThunk("users/remove", async (id) => {
    return await userService.deleteUser(id);
});

// Slice
const userSlice = createSlice({
    name: "users",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Add
            .addCase(addUser.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })

            // Edit
            .addCase(editUser.fulfilled, (state, action) => {
                const index = state.items.findIndex((u) => u.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })

            // Remove
            .addCase(removeUser.fulfilled, (state, action) => {
                state.items = state.items.filter((u) => u.id !== action.payload);
            });
    },
});

export const userReducer = userSlice.reducer;