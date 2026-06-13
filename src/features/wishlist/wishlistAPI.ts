import apiClient from "../../api/apiClient";

// Add to wishlist
export const addToWishlistAPI = (productId: number) =>
  apiClient.post("/product/wishlist/", { product_id: productId });

// Get wishlist products
export const fetchWishlistAPI = () => apiClient.get("/product/wishlist/");

// Remove from wishlist
export const removeFromWishlistAPI = (wishlistId: number) =>
  apiClient.delete(`/product/wishlist/${wishlistId}/`);


// Check product in cart & wishlist
export const checkProductInCartWishlistAPI = (productId: number) =>
  apiClient.get(`/product/product_check_cart_wishlist/?product_id=${productId}`);

