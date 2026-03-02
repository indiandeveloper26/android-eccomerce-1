import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk: API se products fetch
export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch("http://192.168.31.144:300/api/productdata", { cache: "no-store" });
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
        setProductsFromStorage: (state, action) => {
            state.products = action.payload;
            state.loaded = true;
        },
        clearProducts: (state) => {
            state.products = [];
            state.loaded = false;
            localStorage.removeItem("products");
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
                // Cache in localStorage
                localStorage.setItem("products", JSON.stringify(action.payload));
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch products";
            });
    },
});

export const { setProductsFromStorage, clearProducts } = productsSlice.actions;
export default productsSlice.reducer;
