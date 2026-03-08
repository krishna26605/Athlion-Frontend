import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Debugging: Log the full URL
        const fullUrl = config.baseURL ? (config.baseURL.endsWith('/') ? config.baseURL + config.url : config.baseURL + '/' + config.url) : config.url;
        console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${fullUrl}`);

        return config;
    },
    (error) => {
        console.error('❌ [API Request Error]', error);
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove('token');
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }

        // Debugging: Log 404 errors with more detail
        if (error.response?.status === 404) {
            const fullUrl = error.config.baseURL ? (error.config.baseURL.endsWith('/') ? error.config.baseURL + error.config.url : error.config.baseURL + '/' + error.config.url) : error.config.url;
            console.error('🔍 [API 404 Error] Resource not found at:', fullUrl);
        }

        console.error('❌ [API Response Error]', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default apiClient;
