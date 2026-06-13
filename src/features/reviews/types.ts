// src/features/reviews/types.ts
export interface Review {
  id: number;
  product: number;
  product_name: string;
  user: number;
  user_name: string | null;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewsResponse {
  status: number;
  message: string;
  total_items: number;
  page: number;
  current_page_size: number;
  total_pages_size: number;
  next: string | null;
  previous: string | null;
  data: Review[];
  average_rating: number;
  total_reviews: number;
}