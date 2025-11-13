import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../../services/productService";

// ==========================
// THUNKS - GET
// ==========================

export const fetchProducts = createAsyncThunk("items/fetchAll", async () => {
  return await productService.getAllProducts();
});

export const fetchProductById = createAsyncThunk(
  "items/fetchById",
  async (id) => {
    return await productService.getProductById(id);
  }
);

export const fetchProductByTitle = createAsyncThunk(
  "items/fetchByTitle",
  async (title) => {
    return await productService.getProductsByTitle(title);
  }
);

export const fetchProductByUserId = createAsyncThunk(
  "items/fetchByUserId",
  async (userId) => {
    return await productService.getProductByUserId(userId);
  }
);

// ==========================
// THUNKS - PRODUCT
// ==========================

export const addProduct = createAsyncThunk("products/add", async (product) => {
  return await productService.createProduct(product);
});

export const editProduct = createAsyncThunk(
  "products/edit",
  async ({ id, ...productData }) => {
    return await productService.updateProduct(id, productData);
  }
);

export const removeProduct = createAsyncThunk(
  "products/remove",
  async (id) => await productService.deleteProduct(id)
);

// ==========================
// THUNKS - VEHICLE
// ==========================

export const addVehicle = createAsyncThunk("vehicles/add", async (vehicle) => {
  return await productService.createVehicle(vehicle);
});

export const editVehicle = createAsyncThunk(
  "vehicles/edit",
  async ({ id, ...vehicleData }) => {
    return await productService.updateVehicle(id, vehicleData);
  }
);

export const removeVehicle = createAsyncThunk(
  "vehicles/remove",
  async (id) => await productService.deleteVehicle(id)
);

// ==========================
// SLICE
// ==========================

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    userProducts: [],
    productDetail: null,
    loading: false,
    error: null,
    success: false,
  },

  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
    clearProductDetail: (state) => {
      state.productDetail = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ===============================
      // GET ALL
      // ===============================
      .addCase(fetchProducts.pending, (state) => {
        state.products = [];
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.products = payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.error = "Erro ao buscar produtos";
        state.loading = false;
        state.products = [];
      })

      // GET BY ID
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productDetail = action.payload;
      })

      // GET BY USER
      .addCase(fetchProductByUserId.fulfilled, (state, action) => {
        state.userProducts = action.payload;
      })

      // GET BY TITLE
      .addCase(fetchProductByTitle.fulfilled, (state, action) => {
        state.products = action.payload;
      })

      // ===============================
      // PRODUCT CRUD
      // ===============================

      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, { payload }) => {
        state.products.push(payload);
        state.loading = false;
        state.success = true;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(editProduct.fulfilled, (state, { payload }) => {
        const index = state.products.findIndex((p) => p.id === payload.id);
        if (index !== -1) state.products[index] = payload;
        state.success = true;
      })

      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.meta.arg);
        state.success = true;
      })

      // ===============================
      // VEHICLE CRUD
      // ===============================

      .addCase(addVehicle.pending, (state) => {
        state.loading = true;
      })
      .addCase(addVehicle.fulfilled, (state, { payload }) => {
        state.products.push(payload);
        state.loading = false;
        state.success = true;
      })

      .addCase(editVehicle.fulfilled, (state, { payload }) => {
        const index = state.products.findIndex((v) => v.id === payload.id);
        if (index !== -1) state.products[index] = payload;
        state.success = true;
      })

      .addCase(removeVehicle.fulfilled, (state, action) => {
        state.products = state.products.filter((v) => v.id !== action.meta.arg);
        state.success = true;
      });
  },

  selectors: {
    selectAllProducts: (state) => state.products,
    selectLoading: (state) => state.loading,
    selectError: (state) => state.error,
    selectSuccess: (state) => state.success,
  },
});

export const { resetSuccess, clearProductDetail } = productSlice.actions;
export const { selectAllProducts, selectLoading, selectError, selectSuccess } =
  productSlice.selectors;

export const productReducer = productSlice.reducer;