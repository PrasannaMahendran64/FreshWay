import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk: Fetch Cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/cart");
      return data.data.cart || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
    }
  }
);

// Thunk: Add / Increase Qty in Cart
export const addToCartApi = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/cart/add", { productId, quantity });
      return data.data.cart || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add to cart");
    }
  }
);

// Thunk: Update Cart Item Quantity
export const updateCartQtyApi = createAsyncThunk(
  "cart/updateCartQty",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put("/api/cart/update", { productId, quantity });
      return data.data.cart || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update quantity");
    }
  }
);

// Thunk: Remove Item from Cart
export const removeCartItemApi = createAsyncThunk(
  "cart/removeCartItem",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/cart/remove/${productId}`);
      return data.data.cart || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove from cart");
    }
  }
);

// Thunk: Clear Cart
export const clearCartApi = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete("/api/cart/clear");
      return data.data.cart || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to clear cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCartState: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to Cart
      .addCase(addToCartApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCartApi.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addToCartApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Qty
      .addCase(updateCartQtyApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartQtyApi.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(updateCartQtyApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove Item
      .addCase(removeCartItemApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCartItemApi.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(removeCartItemApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear Cart
      .addCase(clearCartApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearCartApi.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(clearCartApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
