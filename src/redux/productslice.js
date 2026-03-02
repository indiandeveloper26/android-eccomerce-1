import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import api from '../componet/axios';

export const productApi = createApi({
    reducerPath: 'productApi',
    // Local IP use karein mobile testing ke liye
    baseQuery: fetchBaseQuery({ baseUrl: 'https://eccomerce-wine.vercel.app/' }),
    tagTypes: ['Products'], // Caching ke liye tags
    endpoints: (builder) => ({
        // Get all products query
        getProducts: builder.query({
            query: () => 'api/productdata',
            providesTags: ['Products'],
            transformResponse: (response) => {
                console.log("🚀 API Response Ayi:", response); // Ye line add karein
                return response.products || response;
            },
        }),
    }),
});

// Auto-generated hook ko export karein
export const { useGetProductsQuery } = productApi;