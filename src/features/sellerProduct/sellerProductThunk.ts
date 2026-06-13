import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchSellerProductsAPI,
  fetchSellerProductByIdAPI,
  createSellerProductAPI,
  updateSellerProductAPI,
  deleteSellerProductAPI,
} from './sellerProductAPI';
import { SellerProductsResponse } from './sellerProductTypes';

// Fetch all seller products with pagination
export const fetchSellerProducts = createAsyncThunk(
  'sellerProduct/fetchAll',
  async (query: string = '', thunkAPI) => {
    try {
      const res = await fetchSellerProductsAPI(query);
      const responseData = res.data as SellerProductsResponse;
      
      return {
        data: responseData.data,
        pagination: {
          total_items: responseData.total_items,
          current_page: responseData.page,
          current_page_size: responseData.current_page_size,
          total_pages: responseData.total_pages_size,
          next: responseData.next,
          previous: responseData.previous
        }
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch seller products'
      );
    }
  }
);

// Fetch single seller product by ID
// export const fetchSellerProductById = createAsyncThunk(
//   'sellerProduct/fetchById',
//   async (id: number, thunkAPI) => {
//     try {
//       const res = await fetchSellerProductByIdAPI(id);
//       return res.data;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || 'Failed to fetch product details'
//       );
//     }
//   }
// );

export const fetchSellerProductById = createAsyncThunk(
  'sellerProduct/fetchById',
  async (id: number, thunkAPI) => {
    try {
      const res = await fetchSellerProductByIdAPI(id);
      console.log('API Response:', res.data); // Debug log
      
      // ✅ Extract product from data array
      const product = res.data.data?.[0] || res.data;
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      return product;
    } catch (error: any) {
      console.error('Fetch product error:', error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product details'
      );
    }
  }
);

// Create new seller product
export const createSellerProduct = createAsyncThunk(
  'sellerProduct/create',
  async (productData: any, thunkAPI) => {
    try {
      const res = await createSellerProductAPI(productData);
      console.log("Product created successfully:", res.data);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Failed to create product'
      );
    }
  }
);

// Update seller product
export const updateSellerProduct = createAsyncThunk(
  'sellerProduct/update',
  async ({ id, productData }: { id: number; productData: any }, thunkAPI) => {
    console.log('Thunk updateSellerProduct called with ID:', id, 'Data:', productData);
    try {
      const res = await updateSellerProductAPI(id, productData);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Failed to update product'
      );
    }
  }
);

// Delete seller product
export const deleteSellerProduct = createAsyncThunk(
  'sellerProduct/delete',
  async (id: number, thunkAPI) => {
    try {
      await deleteSellerProductAPI(id);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Failed to delete product'
      );
    }
  }
);