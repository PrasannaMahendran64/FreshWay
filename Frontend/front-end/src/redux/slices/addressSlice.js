import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk: Fetch Addresses
export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/address");
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch addresses");
    }
  }
);

// Thunk: Add Address
export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/address", addressData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add address");
    }
  }
);

// Thunk: Update Address
export const updateAddressApi = createAsyncThunk(
  "address/updateAddress",
  async ({ addressId, addressData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/address/${addressId}`, addressData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update address");
    }
  }
);

// Thunk: Delete Address
export const deleteAddressApi = createAsyncThunk(
  "address/deleteAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/address/${addressId}`);
      return addressId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete address");
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAddressState: (state) => {
      state.addresses = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Addresses
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Address
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
        // Put default address at the start of array if applicable
        if (action.payload.isDefault) {
          state.addresses = state.addresses.map((a) =>
            a._id === action.payload._id ? a : { ...a, isDefault: false }
          );
        }
        // Sort: defaults first
        state.addresses.sort((x, y) => (x.isDefault === y.isDefault ? 0 : x.isDefault ? -1 : 1));
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Address
      .addCase(updateAddressApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAddressApi.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.map((a) =>
          a._id === action.payload._id ? action.payload : a
        );
        if (action.payload.isDefault) {
          state.addresses = state.addresses.map((a) =>
            a._id === action.payload._id ? a : { ...a, isDefault: false }
          );
        }
        // Sort: defaults first
        state.addresses.sort((x, y) => (x.isDefault === y.isDefault ? 0 : x.isDefault ? -1 : 1));
      })
      .addCase(updateAddressApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Address
      .addCase(deleteAddressApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAddressApi.fulfilled, (state, action) => {
        state.loading = false;
        const wasDefault = state.addresses.find((a) => a._id === action.payload)?.isDefault;
        state.addresses = state.addresses.filter((a) => a._id !== action.payload);
        // If we deleted default, mark the first remaining one as default in state temporarily (backend will handle actual DB default reassignment)
        if (wasDefault && state.addresses.length > 0) {
          state.addresses[0].isDefault = true;
        }
      })
      .addCase(deleteAddressApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAddressState } = addressSlice.actions;
export default addressSlice.reducer;
