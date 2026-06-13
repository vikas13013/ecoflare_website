import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiClient";
import { stripeService, CreatePaymentIntentData } from "../../services/stripeService";

// ✅ Import the actions from orderSlice
import { setPaymentStatus, setPaymentIntent, clearPaymentIntent } from "./orderSlice";

/*  
|-----------------------------------|
|   1️⃣ CREATE ORDER (Your API)      |
|-----------------------------------|
*/
export const createOrder = createAsyncThunk(
  "order/create",
  async (orderData: any, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/orders/create_order/", orderData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error creating order");
    }
  }
);

/*  
|-----------------------------------|
|   2️⃣ GET ORDER (Your API)         |
|-----------------------------------|
*/
export const getOrder = createAsyncThunk(
  "order/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/orders/create_order/");
      console.log(response.data, "order data from thuck ");
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error fetching order");
    }
  }
);

/*  
|-----------------------------------|
|   2️⃣ GET ORDER ITEMS BY DATE     |
|-----------------------------------|
*/

export const getOrderItemsByDate = createAsyncThunk(
  "order/getOrderItemsByDate",
  async (
    { startDate, endDate }: { startDate: string; endDate: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token");

      const response = await api.get(
        `/orders/order-items/?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data, "Order items by date response from thunck");

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Error fetching order items by date"
      );
    }
  }
);


/*  
|-----------------------------------|
|   3️⃣ CLEAR ORDER                  |
|-----------------------------------|
*/
export const clearOrder = createAsyncThunk("order/clear", async () => {
  return null;
});



export const createPaymentIntent = createAsyncThunk(
  "order/createPaymentIntent",
  async (paymentData: CreatePaymentIntentData, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token found");

      console.log("🔑 Token found, creating payment intent...");
      
      const response = await stripeService.createPaymentIntent(paymentData, token);

      console.log("✅ Payment intent response:", response);

      // ✅ FIX: Use correct field names from API response
      dispatch(setPaymentIntent({
        clientSecret: response.data.client_secret, // ✅ client_secret (not clientSecret)
        paymentIntentId: response.data.payment_intent_id // ✅ payment_intent_id (not paymentIntentId)
      }));

      return response;
    } catch (error: any) {
      console.error("❌ createPaymentIntent error:", error);
      dispatch(setPaymentStatus('failed'));
      return rejectWithValue(error.message || "Error creating payment intent");
    }
  }
);

