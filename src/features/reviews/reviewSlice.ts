// src/features/reviews/reviewSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createReview, fetchProductReviews } from './reviewThunks';
import { ReviewsResponse, Review } from './types';

/* ---------- Initial State ---------- */
interface ReviewState {
  reviewsData: ReviewsResponse | null;
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
  successMessage: string | null;
}

const initialState: ReviewState = {
  reviewsData: null,
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  successMessage: null,
};

/* ---------- Slice ---------- */
const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
      state.createError = null;
    },
    clearReviewSuccess: (state) => {
      state.successMessage = null;
    },
    resetReviewState: () => initialState,
  },
  extraReducers: (builder) => {
    // Create Review Cases
    builder
      .addCase(createReview.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.successMessage = null;
      })
      .addCase(createReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.createLoading = false;
        state.successMessage = 'Review submitted successfully';
        
        // Agar existing reviews hain toh naya review add karein
        if (state.reviewsData) {
          state.reviewsData.data.unshift(action.payload);
          state.reviewsData.total_items += 1;
          state.reviewsData.total_reviews += 1;
        }
      })
      .addCase(createReview.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload as string;
      });

    // Fetch Reviews Cases
    builder
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action: PayloadAction<ReviewsResponse>) => {
        state.loading = false;
        state.reviewsData = action.payload;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearReviewError, clearReviewSuccess, resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;