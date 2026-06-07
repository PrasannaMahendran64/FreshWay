import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import wishlistReducer from "./slices/wishlistSlice";
import addressReducer from "./slices/addressSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    cart: cartReducer,
    order: orderReducer,
    wishlist: wishlistReducer,
    address: addressReducer,
  },
});

export default store;
