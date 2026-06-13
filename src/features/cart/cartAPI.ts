import apiClient from "../../api/apiClient";

// Add to cart
export const addToCartAPI = (payload: { user: number; product: number; quantity: number }) =>
  apiClient.post("/product/add-to-cart/", payload);

// export const getCartAPI = () => apiClient.get("/product/add-to-cart/");

export const getCartAPI = (addressId?: string | number) => {
  return apiClient.get("/product/add-to-cart/", {
    params: addressId ? { address_id: addressId } : {},
  });
};

// Update cart item
export const updateCartAPI = (id: number, payload: { quantity: number }) =>
  apiClient.patch(`/product/add-to-cart/${id}/`, payload);

// Delete cart item
export const deleteCartAPI = (id: number) =>
  apiClient.delete(`/product/add-to-cart/${id}/`);
