// src/features/auth/authAPI.js
import apiClient from '../../api/apiClient';

export const registerUserAPI = (data) => apiClient.post('/account/register/', data);
export const registerSellerAPI = (data) => apiClient.post('/account/user-seller/', data);
export const registerSellerBranch = (data) => apiClient.post('/account/user-seller-branch/', data);
export const fetchSellerBranch = () => apiClient.get('/account/user-seller-branch/');
export const updateSellerBranch = (id, data) => apiClient.patch(`/account/user-seller-branch/${id}/`, data);
export const deleteSellerBranch = (id) => apiClient.delete(`/account/user-seller-branch/${id}/`);
export const getUserProfileAPI = () => apiClient.get('/account/user-profile/');
export const getprovinces = () => apiClient.get('/account/provinces/');
export const loginUserAPI = (data) => apiClient.post('/account/login/', data);
export const forgetPasswordRequestAPI = (data) => apiClient.post('/account/forget-password-request/', data);
export const verifyOtpAPI = (data) => apiClient.post('/account/verify_otp/', data);
// export const resetPasswordAPI = (data) => apiClient.post('/forget-password/', data);
export const resetPasswordAPI = (data) => apiClient.post('/account/forget-password/', data);
export const changePasswordAPI = (data) => apiClient.post('/account/change-password/', data);
export const updateUserProfileAPI = (formData: FormData) => {
  return apiClient.patch('/account/user-profile/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};