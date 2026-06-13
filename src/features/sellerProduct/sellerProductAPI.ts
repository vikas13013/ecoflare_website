import { log } from 'node:console';
import apiClient from '../../api/apiClient';

// Get all seller products
export const fetchSellerProductsAPI = (query = '') => {
  return apiClient.get(`/product/seller/products/${query}`);
};

// Get single seller product by ID
export const fetchSellerProductByIdAPI = (id: number) => {
  return apiClient.get(`/product/products/${id}/`);
};

// Create new seller product
export const createSellerProductAPI = (productData: any) => {
  return apiClient.post('/product/seller/products/', productData);
};

// Update seller product
export const updateSellerProductAPI = (id: number, productData: any) => {
  console.log('Updating product with ID:', id, 'Data:', productData);
  return apiClient.patch(`/product/seller/products/${id}/`, productData);
};

// Delete seller product
export const deleteSellerProductAPI = (id: number) => {
  return apiClient.delete(`/product/seller/products/${id}/`);
};