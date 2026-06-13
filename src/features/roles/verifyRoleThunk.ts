// src/features/roles/verifyRoleThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { verifyRolesAPI } from './verifyRoleAPI';

export const fetchVerifyRoles = createAsyncThunk(
  'roles/verify',
  async (_, thunkAPI) => {
    try {
      const res = await verifyRolesAPI();
      console.log(res.data.data, 'verify roles data');
      return res.data.data; // 👈 sirf data return
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Verify roles failed'
      );
    }
  }
);
