import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addToWishlistAPI,
  fetchWishlistAPI,
  removeFromWishlistAPI,
  checkProductInCartWishlistAPI
} from "./wishlistAPI";

// ✅ Add product to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId: number, thunkAPI) => {
    try {
      const res = await addToWishlistAPI(productId);
      console.log(res, 'res add to wishlist');
      
      return res.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Add failed");
    }
  }
);

// ✅ Fetch all wishlist products
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await fetchWishlistAPI();
      // console.log(res.data, 'res fetch wishlist');
      return res.data.data;
      
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Fetch failed");
    }
  }
);

// ✅ Remove product from wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (wishlistId: number, thunkAPI) => {
    try {
      await removeFromWishlistAPI(wishlistId);
      return wishlistId;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Remove failed");
    }
  }
);

// ✅ Check product in cart & wishlist
export const checkProductInCartWishlist = createAsyncThunk(
  "wishlist/checkProduct",
  async (productId: number, thunkAPI) => {
    try {
      const res = await checkProductInCartWishlistAPI(productId);
      // console.log(res.data);
      
      return res.data;   
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Check failed");
    }
  }
);
