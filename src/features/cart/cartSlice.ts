import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addToCart, updateCart, deleteCart, getCart } from "./cartThunk";
import { current } from "@reduxjs/toolkit";

interface CartItem {
  id: number;
  user: number;
  product: number;
  quantity: number;
  data: any;
}



interface CartState {
  items: CartItem[];

  loading: boolean;
  error: string | null;
  updating: string | null; // id of item being updated
  deleting: string | null;
  summary: any; // Cart summary details
}

const initialState: CartState = {
  items: [] as any[],
  summary: null,
  loading: false,
  error: null,
  updating: null, // <-- Bas null rakho
  deleting: null, // <-- Yaha bhi null
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        addToCart.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          state.loading = false;

          console.log("DEBUG [addToCart.fulfilled] state.items =", state.items);
          console.log("DEBUG [addToCart.fulfilled] payload =", action.payload);

          if (!Array.isArray(state.items)) {
            console.warn("state.items was not an array, resetting to []");
            state.items = [];
          }

          state.items.push(action.payload);
        }
      )

      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getCart.fulfilled,
        (state, action: PayloadAction<CartItem[]>) => {
          state.loading = false;
          // state.items = action.payload;
          // Sirf data array assign karo
          state.items = action.payload.data || [];
          // Agar cart summary chahiye to alag field banao
          state.summary = action.payload.cart_summary || null;
        }
      )
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateCart.pending, (state, action) => {
        // state.loading = true;
        state.updating = action.meta.arg.id;
      })

      .addCase(updateCart.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.updating = null;

        console.log("🟢 state.items before:", current(state.items));
        console.log("🟢 updateCart payload:", action.payload);

        const updatedItem = action.payload;

        const index = state.items.findIndex(
          (item) => item.id === updatedItem.id
        );

        if (index !== -1) {
          state.items[index] = updatedItem;
        } else {
          state.items.push(updatedItem);
        }
      })

      .addCase(updateCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.updating = null;
      })

      // Delete
      .addCase(deleteCart.pending, (state, action) => {
        // state.loading = true;
        state.deleting = action.meta.arg;
      })
      .addCase(deleteCart.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.deleting = null;

        // ✅ Debug log
        console.log(
          "Before deleteCart:",
          JSON.parse(JSON.stringify(state.items))
        );

        // ✅ Ensure items is always array
        if (!Array.isArray(state.items)) {
          console.warn("⚠ state.items was not an array, resetting to []");
          state.items = [];
        }

        state.items = state.items.filter((item) => item.id !== action.payload);

        // ✅ Debug log
        console.log(
          "After deleteCart:",
          JSON.parse(JSON.stringify(state.items))
        );
      })

      .addCase(deleteCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.deleting = null;
      });
  },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
