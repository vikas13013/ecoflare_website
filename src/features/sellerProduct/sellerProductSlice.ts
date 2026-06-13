import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchSellerProducts,
  fetchSellerProductById,
  createSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
} from "./sellerProductThunk";
import { SellerProductState, SellerProduct } from "./sellerProductTypes";

const initialState: SellerProductState = {
  products: [],
  productDetails: {
    data: null,
    loading: false,
    error: null,
  },
  loading: false,
  error: null,
  successMessage: null,
  pagination: {
    total_items: 0,
    current_page: 1,
    current_page_size: 12,
    total_pages: 0,
    next: null,
    previous: null,
  },
};

const sellerProductSlice = createSlice({
  name: "sellerProduct",
  initialState,
  reducers: {
    clearSellerProductError(state) {
      state.error = null;
    },
    clearSellerSuccessMessage(state) {
      state.successMessage = null;
    },
    clearProductDetails(state) {
      state.productDetails.data = null;
      state.productDetails.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all seller products
      .addCase(fetchSellerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch product by ID
      .addCase(fetchSellerProductById.pending, (state) => {
        state.productDetails.loading = true;
        state.productDetails.error = null;
      })
      .addCase(fetchSellerProductById.fulfilled, (state, action) => {
        state.productDetails.loading = false;
        state.productDetails.data = action.payload;
      })
      .addCase(fetchSellerProductById.rejected, (state, action) => {
        state.productDetails.loading = false;
        state.productDetails.error = action.payload as string;
      })

      // Create seller product
      .addCase(createSellerProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createSellerProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Product created successfully!";
        // Optionally add the new product to the list
        state.products.unshift(action.payload);
      })
      .addCase(createSellerProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update seller product
      .addCase(updateSellerProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateSellerProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Product updated successfully!";
        
        // Update product in the list
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        
        // Update product details if it's the same product
        if (state.productDetails.data?.id === action.payload.id) {
          state.productDetails.data = action.payload;
        }
      })
      .addCase(updateSellerProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete seller product
      .addCase(deleteSellerProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteSellerProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Product deleted successfully!";
        
        // Remove product from the list
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      })
      .addCase(deleteSellerProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearSellerProductError,
  clearSellerSuccessMessage,
  clearProductDetails,
} = sellerProductSlice.actions;

export default sellerProductSlice.reducer;