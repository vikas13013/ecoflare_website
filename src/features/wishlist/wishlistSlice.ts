import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist,
  checkProductInCartWishlist,
} from "./wishlistThunk";

interface ProductCheckStatus {
  product_id: number;
  user_id: number;
  in_cart: boolean;
  in_wishlist: boolean;
  cart_id?: number;
  wishlist_id?: number;
}

interface WishlistItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  image: string;
}

interface WishlistState {
  items: any[];
  loading: boolean;
  error: string | null;
  checkStatus: null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
  checkStatus: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlistError(state) {
      state.error = null;
    },
    updateCheckStatus(
      state,
      action: PayloadAction<Partial<ProductCheckStatus>>
    ) {
      if (state.checkStatus) {
        console.log(state.checkStatus, "state.checkStatus");
        console.log(action.payload, "action.payload");

        state.checkStatus = { ...state.checkStatus, ...action.payload };
      } else {
        state.checkStatus = action.payload as ProductCheckStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder;

    builder
      // ✅ Check Product In Cart/Wishlist
      .addCase(checkProductInCartWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        checkProductInCartWishlist.fulfilled,
        (state, action: PayloadAction<ProductCheckStatus>) => {
          state.loading = false;
          state.checkStatus = action.payload; // 👈 API ka response state me set ho jayega
        }
      )
      .addCase(checkProductInCartWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchWishlist.fulfilled,
        (state, action: PayloadAction<WishlistItem[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        addToWishlist.fulfilled,
        (state, action: PayloadAction<WishlistItem>) => {
          state.loading = false;

          if (!Array.isArray(state.items)) {
            state.items = [];
          }

          state.items.push(action.payload);
        }
      )

      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Remove from wishlist
      .addCase(
        removeFromWishlist.fulfilled,
        (state, action: PayloadAction<number>) => {
          console.log(
            "DEBUG [removeFromWishlist.fulfilled] state.items =",
            state.items
          );

          console.log(
            "DEBUG [removeFromWishlist.fulfilled] action.payload =",
            action.payload
          );

          state.items = state.items.filter(
            (item) => item.id !== action.payload
          );
        }
      )
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// export const { clearWishlistError } = wishlistSlice.actions;
export const { clearWishlistError, updateCheckStatus } = wishlistSlice.actions;
export default wishlistSlice.reducer;
