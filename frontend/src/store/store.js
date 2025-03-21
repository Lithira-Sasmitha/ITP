import { configureStore } from '@reduxjs/toolkit';
import expenseReducer from './reducer'; 
import { apiSlice } from './apiSLice';

export const store = configureStore({
    reducer: {
        expense: expenseReducer,  
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware)
});