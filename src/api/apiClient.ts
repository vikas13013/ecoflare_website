import axios from 'axios';

const apiClient = axios.create({
  // baseURL: 'http://147.182.150.180:12002/',
  baseURL: 'https://api.ecoflaresolutions.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Function to refresh access token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No refresh token found');

  const res = await axios.post('http://147.182.150.180:12002/account/refresh', {
    refreshToken: refreshToken,
  });

  const newAccessToken = res.data.access;
  localStorage.setItem('accessToken', newAccessToken);
  return newAccessToken;
};

// ✅ Request Interceptor: Add Authorization header
apiClient.interceptors.request.use((config) => {
  const publicPaths = ['/account/register/', '/account/login/', '/account/forget-password-request/'];
  const isPublic = publicPaths.some((path) => config.url?.includes(path));

  const token = localStorage.getItem('accessToken');
  
  if (!isPublic && token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Response Interceptor: Handle token expiry and refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt token refresh if:
    // 1. Status is 401 (Unauthorized)
    // 2. The request is not a retry
    // 3. There's an existing access token (to avoid refresh on login)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('accessToken')
    ) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest); // Retry the original request
      } catch (refreshError) {
        // Refresh token failed → logout only if not on public page
        localStorage.clear();

        const publicPaths = ['/register', '/login', '/forget-password-request'];
        const currentPath = window.location.pathname;
        const isPublicPath = publicPaths.some((path) => currentPath.includes(path));

        if (!isPublicPath) {
          window.location.href = '/login'; // Redirect to login instead of register
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error.response?.data || 'Something went wrong');
  }
);

export default apiClient;