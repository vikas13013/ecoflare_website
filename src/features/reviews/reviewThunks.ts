// src/features/reviews/reviewThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createReviewAPI, fetchProductReviewsAPI } from './reviewAPI';

// Create Review Thunk
export const createReview = createAsyncThunk(
  'reviews/create',
  async ({ productId, rating, title, comment }: {
    productId: number;
    rating: number;
    title: string;
    comment: string;
  }, thunkAPI) => {
    try {
      const res = await createReviewAPI({ productId, rating, title, comment });
      return res.data.data; // API response format ke hisaab se
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Review creation failed'
      );
    }
  }
);

// Fetch Reviews Thunk
export const fetchProductReviews = createAsyncThunk(
  'reviews/fetch',
  async (productId: number, thunkAPI) => {
    try {
      const res = await fetchProductReviewsAPI(productId);
      return res.data; // Full response data return karein
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Failed to fetch reviews'
      );
    }
  }
);