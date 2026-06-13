import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchAddressesAPI,
  createAddressAPI,
  updateAddressAPI,
  deleteAddressAPI,
} from './addressAPI';

export const fetchAddresses = createAsyncThunk('address/fetch', async (_, thunkAPI) => {
  try {
    const res = await fetchAddressesAPI();
    return res.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Fetch failed');
  }
});

export const createAddress = createAsyncThunk('address/create', async (data: any, thunkAPI) => {
  try {
    const res = await createAddressAPI(data);
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Create failed');
  }
});

export const updateAddress = createAsyncThunk(
  'address/update',
  async ({ id, data }: { id: number; data: any }, thunkAPI) => {
    try {
      const res = await updateAddressAPI(id, data);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Update failed');
    }
  }
);

export const deleteAddress = createAsyncThunk('address/delete', async (id: number, thunkAPI) => {
  try {
    await deleteAddressAPI(id);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Delete failed');
  }
});
