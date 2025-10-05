import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../../services/productService";

// Thunks assync

export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  return await productService.getAllProducts();
});

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async () => await productService.getCategories()
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id) => {
    await productService.getProductById(id);
  }
);

export const fetchProductByTitle = createAsyncThunk(
  "products/fetchByName",
  async (title) => {
    await productService.getProductsByTitle(title);
  }
);

export const fetchProductByUserId = createAsyncThunk(
  "products/fetchByUserId",
  async (userId) => {
    await productService.getProductByUserId(userId);
  }
)

export const addProduct = createAsyncThunk("products/add", async (product) => {
  return await productService.createProduct(product);
});

export const editProduct = createAsyncThunk(
  "products/edit",
  async ({ id, productData }) => {
    await productService.updateProduct(id, productData);
  }
);

export const removeProduct = createAsyncThunk(
  "products/remove",
  async (id) => await productService.deleteProduct(id)
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],       // todos os produtos
    userProducts: [],   // só do usuário logado
    productDetail: null,
    categories: [],
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
      // 🔹 Buscar todos
      .addCase(fetchProducts.pending, (state) => {
        state.products = [];
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.products = payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, { payload }) => {
        state.error = 'Erro ao buscar produtos';
        state.loading = false;
        state.products = [];
        console.error(payload);
      })

      // 🔹 Buscar por ID
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productDetail = action.payload;
      })

      // 🔹 Buscar por userID
      .addCase(fetchProductByUserId.fulfilled, (state, action) => {
        state.userProducts = action.payload;
      })

      // 🔹 Buscar por nome
      .addCase(fetchProductByTitle.fulfilled, (state, action) => {
        state.products = action.payload;
      })

      // 🔹 Criar produto
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.products.push(payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // 🔹 Editar produto
      .addCase(editProduct.fulfilled, (state) => {
        state.success = true;
      })

      // 🔹 Excluir produto
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.meta.arg);
        state.success = true;
      })

      // 🔹 Categorias
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
  selectors: {
    selectAllProducts: (state) => state.products,
    selectLoading: (state) => state.loading,
    selectError: (state) => state.error,
    selectSuccess: (state) => state.success,
  }
});

export const { resetSuccess, clearProductDetail } = productSlice.actions;
export const { selectAllProducts, selectLoading, selectError, selectSuccess } = productSlice.selectors;
export const productReducer = productSlice.reducer;