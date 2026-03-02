import axios from 'axios';

// 1. Base configuration
const api = axios.create({
    baseURL: 'https://eccomerce-wine.vercel.app/',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// 2. Request Interceptor
// Agar aapko token pass karna ho toh yahan handle kar sakte hain
api.interceptors.request.use(
    (config) => {
        // Yahan aap local storage ya kisi variable se token le sakte hain
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Response Interceptor
api.interceptors.response.use(
    (response) => {
        // Direct data return karega taaki res.data.data na likhna pade
        return response;
    },
    (error) => {
        // Sirf error handle karega bina logout logic ke
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;