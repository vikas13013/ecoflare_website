import apiClient from '../../api/apiClient';

export const fetchCategoriesAPI = () => apiClient.get('/product/categories/');

