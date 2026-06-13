import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCategoriesAPI,
  
} from './categoryAPI';

export const fetchCategories = createAsyncThunk('category/fetch', async (_, thunkAPI) => {
  try {
    const res = await fetchCategoriesAPI();
    console.log(res.data.data , "category data");
    
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Fetch failed');
  }
});





