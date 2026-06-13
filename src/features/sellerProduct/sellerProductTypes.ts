export interface ProductImage {
  id: number;
  product: number;
  image: string;
  alt_text: string;
  created_at: string;
}

export interface QuantityDiscount {
  id: number;
  min_quantity: number;
  max_quantity: number;
  discount_percentage: string;
  shipping_charges: string;
}
export interface ProductPrice {
  base_price: number;
  currency: string;
  discount_tiers: Array<{
    min_quantity: number;
    max_quantity: number;
    discount_percentage: number;
    discounted_price_per_unit: number;
    total_min_amount: number;
    shipping_charges: number;
    final_total: number;
  }>;
  calculated_price: {
    base_price: number;
    discounted_price: number;
    discount_percentage: number;
    total_amount: number;
    shipping_charges: number;
    final_total: number;
    quantity: number;
  };
}

export interface SellerProduct {
  id: number;
  name: string;
  description: string;
  category: Category | number;
  product_image: string | null;
  images: ProductImage[];
  status: string;
  user: number;
  stock_quantity: string;
  is_flexible_buying: boolean;
  is_bulk_buying: boolean;
  is_preorder_produce: boolean;
  growing_session: string;
  product_availability: number;
  organic_certified: boolean;
  canada_grade: string;
  is_negotiable: boolean;
  currency: string;
  base_price: string;
  hst_included: boolean;
  min_order_quantity: string;
  unit: string;
  expiry_date: string;
  harvest_date: string;
  food_safety_certification: string;
  created_at: string;
  updated_at: string;
  is_top_products: boolean;
  quantity_discounts: QuantityDiscount[];
  price?: ProductPrice;
  reviews: any[];
  average_rating: number;
  total_reviews: number;
}

export interface SellerProductsResponse {
  status: number;
  message: string;
  total_items: number;
  page: number;
  current_page_size: number;
  total_pages_size: number;
  next: string | null;
  previous: string | null;
  data: SellerProduct[];
}

export interface SellerProductState {
  products: SellerProduct[];
  productDetails: {
    data: SellerProduct | null;
    loading: boolean;
    error: string | null;
  };
  loading: boolean;
  error: any;
  successMessage: string | null;
  pagination: {
    total_items: number;
    current_page: number;
    current_page_size: number;
    total_pages: number;
    next: string | null;
    previous: string | null;
  };
}