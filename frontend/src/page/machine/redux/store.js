import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../../order/redux/api/apiSlice";
import { productapiSlice } from "./api/productapiSlice"; // API slice for products
import { machineapiSlice } from "./api/machineapiSlice"; // API slice for machines
import { machinepartapiSlice } from "./api/machinepartapiSlice"; // API slice for machine parts
import localStorageUtils from "../Utils/localStorage"; // Utility for local storage (not used here yet, but kept for potential future use)

// Configure the Redux store
export const store = configureStore({
  reducer: {
    // Register API slice reducers
    [productapiSlice.reducerPath]: productapiSlice.reducer, // Reducer for product-related API endpoints
    [machineapiSlice.reducerPath]: machineapiSlice.reducer, // Reducer for machine-related API endpoints
    [machinepartapiSlice.reducerPath]: machinepartapiSlice.reducer,
    // [apiSlice.reducerPath]: apiSlice.reducer, // Reducer for machine part-related API endpoints
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      // apiSlice.middleware,
      productapiSlice.middleware, // Middleware for product API caching and invalidation
      machineapiSlice.middleware, // Middleware for machine API caching and invalidation
      machinepartapiSlice.middleware // Middleware for machine part API caching and invalidation
    ),
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools only in development
});

// Export store as default for use in the app
export default store;