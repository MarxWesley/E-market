import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import favoriteService from "../../services/favoriteService";

export const fetchFavoritesByUserId = createAsyncThunk(
    "favorites/fetchByUserId",
    async (userId) => {
        return await favoriteService.getFavoriteByUserId(userId);
    }
);

export const addFavorite = createAsyncThunk(
    "favorites/add",
    async (favorite) => {
        return await favoriteService.addFavorite(favorite);
    }
);

export const removeFavorite = createAsyncThunk(
    "favorites/remove",
    async (id) => {
        const deletedId = await favoriteService.removeFavorite(id);
        return deletedId; // o reducer receberá esse id
    }
);


const favoriteSlice = createSlice({
    name: "favorites",
    initialState: {
        favorites: [],
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        clearState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavoritesByUserId.pending, (state) => {
                state.favorites = [];
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFavoritesByUserId.fulfilled, (state, { payload }) => {
                state.favorites = payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchFavoritesByUserId.rejected, (state, { payload }) => {
                state.favorites = [];
                state.loading = false;
                state.error = payload;
            })
            // 🔹 Adicionar favorito
            .addCase(addFavorite.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(addFavorite.fulfilled, (state, { payload }) => {
                state.favorites.push(payload); // Adiciona o novo favorito ao array
                state.loading = false;
                state.error = null;
                state.success = true;
            })
            .addCase(addFavorite.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            })
            // 🔹 Remover favorito
            .addCase(removeFavorite.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(removeFavorite.fulfilled, (state, { payload }) => {
                state.favorites = state.favorites.filter((fav) => fav.id !== payload);
                state.loading = false;
                state.error = null;
                state.success = true;
            })
            .addCase(removeFavorite.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            })
    },
    selectors: {
        selectFavorites: (state) => state.favorites,
        selectLoading: (state) => state.loading,
        selectError: (state) => state.error,
        selectSuccess: (state) => state.success,
    }
});

export const { clearState } = favoriteSlice.actions;
export const { selectFavorites, selectLoading, selectError, selectSuccess } = favoriteSlice.selectors;
export const favoriteReducer = favoriteSlice.reducer;