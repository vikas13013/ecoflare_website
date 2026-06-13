import { createAsyncThunk } from "@reduxjs/toolkit";
import { addToCartAPI, updateCartAPI, deleteCartAPI,getCartAPI } from "./cartAPI";
import { log } from "console";

// Add to cart
export const addToCart = createAsyncThunk(
  "cart/add",
  async (
    payload: { user: number; product: number; quantity: number },
    thunkAPI
  ) => {
    try {
      const res = await addToCartAPI(payload);

      // 🔴 IMPORTANT FIX
      if (res.data.status === 1) {
        return thunkAPI.rejectWithValue(res.data.message);
      }

      return res.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Add to cart failed"
      );
    }
  }
);


// Get cart
// export const getCart = createAsyncThunk("cart/get", async (_, thunkAPI) => {
//   try {
//     const res = await getCartAPI();
//     console.log(res.data, "get cart:");
//     return res.data;
//   } catch (error: any) {
//     return thunkAPI.rejectWithValue(error.response?.data || "Get cart failed");
//   }
// });


export const getCart = createAsyncThunk(
  "cart/get",
  async (addressId: string | number | undefined, thunkAPI) => {
    try {
      const res = await getCartAPI(addressId);
      console.log(res.data, "get cart:");
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Get cart failed"
      );
    }
  }
);

// Update cart item
export const updateCart = createAsyncThunk(
  "cart/update",
  async ({ id, quantity }: { id: number; quantity: number }, thunkAPI) => {
    try {
      const res = await updateCartAPI(id, { quantity });
      return res.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

// Delete cart item
export const deleteCart = createAsyncThunk(
  "cart/delete",
  async (id: number, thunkAPI) => {
    try {
      await deleteCartAPI(id);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Delete failed");
    }
  }
);
