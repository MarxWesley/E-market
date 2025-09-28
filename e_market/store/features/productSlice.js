import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../../services/productService";
import { set } from "react-hook-form";

// Thunks assync

export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
    return await productService.getAllProducts();
})

export const fetchCategories = createAsyncThunk("product/fetchCategories", async () =>
    await productService.getCategories()
);

export const fetchProductById = createAsyncThunk("product/fetchById", async (id) => {
    await productService.getProductById(id);
});

export const fetchProductByTitle = createAsyncThunk("product/fetchByName", async (title) => {
    await productService.getProductsByTitle(title);
});

export const addProduct = createAsyncThunk("products/add", async (product) => {
    return await productService.createProduct(product);
})

export const editProduct = createAsyncThunk("product/edit", async ({ id, productData }) => {
    await productService.updateProduct(id, productData)
});

export const removeProduct = createAsyncThunk("product/remove",
    async (id) => await productService.deleteProduct(id)
);

const productSlice = createSlice({
    name: "product",
    initialState: {
        products: [],       // lista de todos os produtos (itens + veículos)
        productDetail: null, // detalhes de um produto específico
        categories: [],      // categorias disponíveis
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetSuccess: (state) => { state.success = false; },
        clearProductDetail: (state) => { state.productDetail = null; },
    },
    extraReducers: (builder) => {
        builder
            // 🔹 Buscar todos
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // 🔹 Buscar por ID
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productDetail = action.payload;
      })

      // 🔹 Buscar por nome
      .addCase(fetchProductByTitle.fulfilled, (state, action) => {
        state.products = action.payload;
      })

      // 🔹 Criar produto
      .addCase(addProduct.pending, (state) => { state.loading = true; })
      .addCase(addProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
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
        state.products = state.products.filter(p => p.id !== action.meta.arg);
        state.success = true;
      })

      // 🔹 Categorias
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});


export const { resetSuccess, clearProductDetail } = productSlice.actions;
export const productReducer = productSlice.reducer;