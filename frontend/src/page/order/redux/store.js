import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import localStorageUtils from "../Utils/localStorage";  // ✅ Ensure correct path

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

// Export store as a named export
export default store; // ✅ Now also exporting as default
