// src/features/product/productAPI.ts
import apiClient from '../../api/apiClient';

export const fetchProductsAPI = (query = '') => {
  return apiClient.get(`/product/products/${query}`);
};

export const fetchTopProductsAPI = () => {
  return apiClient.get('/product/top_products/');
};


export const bulkBuyerAPI = (data:any ) => apiClient.post('/product/bulk-buyer/', data);

