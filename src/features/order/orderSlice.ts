import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createOrder, clearOrder as clearOrderThunk, getOrder, getOrderItemsByDate} from "./orderThunk";

interface OrderState {
  order: any | null;
  orderItems: any[];
  loading: boolean;
  error: string | null;

  // Stripe PaymentIntent
  paymentIntent: {
    clientSecret: string | null;
    paymentIntentId: string | null;
    status: "idle" | "processing" | "succeeded" | "failed";
  };
}

const initialState: OrderState = {
  order: null,
  orderItems: [],
  loading: false,
  error: null,
  paymentIntent: {
    clientSecret: null,
    paymentIntentId: null,
    status: "idle",
  },
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // 👉 Stripe: Save clientSecret + paymentIntentId
    setPaymentIntent: (
      state,
      action: PayloadAction<{ clientSecret: string; paymentIntentId: string }>
    ) => {
      state.paymentIntent.clientSecret = action.payload.clientSecret;
      state.paymentIntent.paymentIntentId = action.payload.paymentIntentId;
      state.paymentIntent.status = "processing";
    },

    // 👉 Stripe: Reset
    clearPaymentIntent: (state) => {
      state.paymentIntent = {
        clientSecret: null,
        paymentIntentId: null,
        status: "idle",
      };
    },

    // 👉 Stripe: Payment success / fail
    setPaymentStatus: (
      state,
      action: PayloadAction<"succeeded" | "failed">
    ) => {
      state.paymentIntent.status = action.payload;
    },

    // Simple order reset
    clearOrder: (state) => {
      state.order = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // CREATE ORDER
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.order = null;
      })

      // GET ORDER
      .addCase(getOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.order = null;
      })
      // =========================
    // GET ORDER ITEMS BY DATE ✅
    // =========================
    .addCase(getOrderItemsByDate.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getOrderItemsByDate.fulfilled, (state, action) => {
      state.loading = false;
      state.orderItems = action.payload;
    })
    .addCase(getOrderItemsByDate.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.orderItems = [];
    })

      // CLEAR ORDER (async thunk)
      .addCase(clearOrderThunk.fulfilled, (state) => {
        state.order = null;
        state.orderItems = [];
      });
  },
});

export const {
  clearOrder,
  setPaymentIntent,
  clearPaymentIntent,
  setPaymentStatus,
} = orderSlice.actions;

export default orderSlice.reducer;
