import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice"; // adjust path if needed
import productsReducer from "./productslice";
const Storee = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
  },
});

export default Storee;




























