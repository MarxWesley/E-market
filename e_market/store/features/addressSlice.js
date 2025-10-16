import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import addressService from "../../services/addressService";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

// thunks
export const fetchAddresses = createAsyncThunk(
  "address/fetchAll",
  async (userId, { rejectWithValue }) => {
    try {
      return await addressService.getAll(userId);
    } catch (e) {
      return rejectWithValue(e?.message || "Falha ao carregar endereços");
    }
  }
);

export const createAddress = createAsyncThunk(
  "address/create",
  async ({ userId, addr }, { rejectWithValue }) => {
    try {
      return await addressService.create(userId, addr);
    } catch (e) {
      return rejectWithValue(e?.message || "Falha ao criar endereço");
    }
  }
);

export const updateAddress = createAsyncThunk(
  "address/update",
  async ({ userId, id, addr }, { rejectWithValue }) => {
    try {
      return await addressService.update(userId, id, addr);
    } catch (e) {
      return rejectWithValue(e?.message || "Falha ao atualizar endereço");
    }
  }
);

export const removeAddress = createAsyncThunk(
  "address/remove",
  async ({ userId, id }, { rejectWithValue }) => {
    try {
      await addressService.remove(userId, id);
      return id; // devolve id para remover do estado
    } catch (e) {
      return rejectWithValue(e?.message || "Falha ao excluir endereço");
    }
  }
);

export const setPrimaryAddress = createAsyncThunk(
  "address/setPrimary",
  async ({ userId, id }, { rejectWithValue }) => {
    try {
      await addressService.setPrimary(userId, id);
      return id; // devolve id que virou principal
    } catch (e) {
      return rejectWithValue(e?.message || "Falha ao definir principal");
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearAddressError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchAddresses.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAddresses.fulfilled, (s, a) => { s.loading = false; s.items = a.payload || []; })
      .addCase(fetchAddresses.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      // create
      .addCase(createAddress.pending, (s) => { s.loading = true; })
      .addCase(createAddress.fulfilled, (s, a) => {
        s.loading = false;
        const item = a.payload;
        // se for o 1º, pode vir marcado como principal no service
        s.items.push(item);
      })
      .addCase(createAddress.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      // update
      .addCase(updateAddress.pending, (s) => { s.loading = true; })
      .addCase(updateAddress.fulfilled, (s, a) => {
        s.loading = false;
        const up = a.payload;
        s.items = s.items.map((i) => (String(i.id) === String(up.id) ? { ...i, ...up } : i));
      })
      .addCase(updateAddress.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      // remove
      .addCase(removeAddress.pending, (s) => { s.loading = true; })
      .addCase(removeAddress.fulfilled, (s, a) => {
        s.loading = false;
        const id = a.payload;
        s.items = s.items.filter((i) => String(i.id) !== String(id));
      })
      .addCase(removeAddress.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      // set primary
      .addCase(setPrimaryAddress.pending, (s) => { s.loading = true; })
      .addCase(setPrimaryAddress.fulfilled, (s, a) => {
        s.loading = false;
        const id = a.payload;
        s.items = s.items.map((i) => ({ ...i, isPrimary: String(i.id) === String(id) }));
      })
      .addCase(setPrimaryAddress.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { clearAddressError } = addressSlice.actions;
export const addressReducer = addressSlice.reducer;
