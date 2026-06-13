// src/features/product/productThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchProductsAPI,
  fetchTopProductsAPI,
  bulkBuyerAPI,
} from './productAPI';



export const fetchProducts = createAsyncThunk(
  'product/fetch',
  async (query: string, thunkAPI) => {
    try {
      const res = await fetchProductsAPI(query);
      // console.log(res.data , "qqdw");
      
      // Return complete response with pagination data
      return {
        data: res.data.data, // products array
        pagination: {
          total_items: res.data.total_items,
          current_page: res.data.page,
          current_page_size: res.data.current_page_size,
          total_pages: res.data.total_pages_size,
          next: res.data.next,
          previous: res.data.previous
        }
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Fetch failed');
    }
  }
);
export const fetchTopProducts = createAsyncThunk(
  'product/fetchTop',
  async (_, thunkAPI) => {
    try {
      const res = await fetchTopProductsAPI();
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Fetch top products failed');
    }
  }
);

export const registerAsBulkBuyer = createAsyncThunk<any, any>('/Bulk-buyer', async (payload, thunkAPI) => {
  try {
    const res = await bulkBuyerAPI(payload);
    return res.data;
  } catch (error: any) {
    console.log(error, 'error');
    
    return thunkAPI.rejectWithValue(error);
  }
});




