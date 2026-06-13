import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchProducts,
  fetchTopProducts,
  registerAsBulkBuyer,
} from "./productThunk";

interface Product {
  id: number;
  name: string;
  price: number | string;
  category: number;
  stock?: number;
  sales?: number;
  // Add other fields as per your API response
}

interface ProductState {
  products: Product[];
  topProducts: Product[];
  productDetails: {
    data: Product | null;
    loading: boolean;
    error: string | null;
  };
  loading: boolean;
  error: any;
  successMessage: string | null;
  pagination: {
    total_items: number;
    current_page: number;
    current_page_size: number;
    total_pages: number;
    next: string | null;
    previous: string | null;
  };
}

const initialState: ProductState = {
  products: [],
  topProducts: [],
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

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductError(state) {
      state.error = null;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchTopProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchTopProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.topProducts = action.payload;
        },
      )
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // registerAsBulkBuyer
      .addCase(registerAsBulkBuyer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerAsBulkBuyer.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Bulk buyer registered successfully!";
      })
      .addCase(registerAsBulkBuyer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export const { clearProductError, clearSuccessMessage } = productSlice.actions;
export default productSlice.reducer;