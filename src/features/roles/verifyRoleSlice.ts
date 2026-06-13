// src/features/roles/verifyRoleSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchVerifyRoles } from './verifyRoleThunk';

/* ---------- Types ---------- */

interface SellerDetails {
  message?: string;
}

interface BulkBuyerApplication {
  bulk_buyer_id: number;
  bulk_buyer_user_id: number;
  bulk_buyer_name: string;
  bulk_buyer_application_status: string;
  bulk_buyer_business_name: string;
  bulk_buyer_type: string;
}

interface VerifyRoleData {
  seller_details?: SellerDetails;
  bulk_buyer_applications?: BulkBuyerApplication;
}

interface VerifyRoleState {
  data: VerifyRoleData | null;
  loading: boolean;
  error: string | null;
}

/* ---------- Initial State ---------- */

const initialState: VerifyRoleState = {
  data: null,
  loading: false,
  error: null,
};

/* ---------- Slice ---------- */

const verifyRoleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    clearVerifyRoleError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVerifyRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchVerifyRoles.fulfilled,
        (state, action: PayloadAction<VerifyRoleData>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchVerifyRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearVerifyRoleError } = verifyRoleSlice.actions;
export default verifyRoleSlice.reducer;
