// src/features/roles/verifyRoleAPI.ts
import apiClient from '../../api/apiClient';

export const verifyRolesAPI = () => {
  return apiClient.get('/account/verify-roles/');
};
