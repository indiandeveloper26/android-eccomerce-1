import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice";

import { productApi } from "./productslice"; // Jo apiSlice hum banayenge
import productsReducer from "./productdata";

export const Storee = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,

    // 1. RTK Query ka reducer add kiya
    [productApi.reducerPath]: productApi.reducer,
  },
  // 2. Middleware setup (ye caching aur auto-refetching ke liye zaroori hai)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
});

export default Storee;




















