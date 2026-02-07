import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Async thunk: API se products fetch
export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch("https://eccomerce-wine.vercel.app/api/productdata");
            if (!res.ok) throw new Error("Failed to fetch products");
            const data = await res.json();
            return data.data || [];
        } catch (err) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

const initialState = {
    products: [],
    loading: false,
    error: null,
    loaded: false, // check karega ki data fetch ho chuka hai
};

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        // Load products from AsyncStorage
        setProductsFromStorage: (state, action) => {
            state.products = action.payload;
            state.loaded = true;
        },
        // Clear products
        clearProducts: (state) => {
            state.products = [];
            state.loaded = false;
            AsyncStorage.removeItem("products");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
                state.loaded = true;
                // Cache in AsyncStorage
                AsyncStorage.setItem("products", JSON.stringify(action.payload));
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch products";
            });
    },
});

export const { setProductsFromStorage, clearProducts } = productsSlice.actions;
export default productsSlice.reducer;
