// src/features/reviews/reviewAPI.ts
import apiClient from '../../api/apiClient';

interface CreateReviewParams {
  productId: number;
  rating: number;
  title: string;
  comment: string;
}

export const createReviewAPI = ({ productId, rating, title, comment }: CreateReviewParams) => {
  return apiClient.post(`/product/products/${productId}/reviews/`, {
    rating,
    title,
    comment
  });
};

export const fetchProductReviewsAPI = (productId: number) => {
  return apiClient.get(`/product/products/${productId}/reviews/`);
};