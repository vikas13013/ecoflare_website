import apiClient from '../../api/apiClient';

export const fetchAddressesAPI = () => apiClient.get('/account/address/');

export const createAddressAPI = (data: any) => apiClient.post('/account/address/', data);

export const updateAddressAPI = (id: number, data: any) =>
  apiClient.patch(`/account/address/${id}/`, data);

export const deleteAddressAPI = (id: number) => apiClient.delete(`/account/address/${id}/`);

export const setDefaultAddressAPI = (id: number) =>
  apiClient.patch(`/address/${id}/set-default/`);