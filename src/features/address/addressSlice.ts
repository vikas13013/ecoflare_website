import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from './addressThunk';

interface Address {
  id: number;
  address: string;
  city: string;
  province: number;
  country: string;
  postal_code: string;
  is_primary: boolean;
  is_rural: boolean;
  user: number;
}

interface AddressState {
  addresses: Address[];
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    clearAddressError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action: PayloadAction<Address[]>) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createAddress.fulfilled, (state, action: PayloadAction<Address>) => {
        state.addresses.push(action.payload);
      })
      .addCase(updateAddress.fulfilled, (state, action: PayloadAction<Address>) => {
        const index = state.addresses.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
      })
      .addCase(deleteAddress.fulfilled, (state, action: PayloadAction<number>) => {
        state.addresses = state.addresses.filter((a) => a.id !== action.payload);
      });
  },
});

export const { clearAddressError } = addressSlice.actions;
export default addressSlice.reducer;
