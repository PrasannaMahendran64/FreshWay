import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk: Fetch Wishlist
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/wishlist");
      return data.data.products || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist");
    }
  }
);

// Thunk: Add to Wishlist
export const addToWishlistApi = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/wishlist/add", { productId });
      return data.data.products || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add to wishlist");
    }
  }
);

// Thunk: Remove from Wishlist
export const removeWishlistApi = createAsyncThunk(
  "wishlist/removeWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/wishlist/remove/${productId}`);
      return data.data.products || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove from wishlist");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlistState: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addToWishlistApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWishlistApi.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addToWishlistApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove
      .addCase(removeWishlistApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeWishlistApi.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(removeWishlistApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
