import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseURL = 'http://localhost:5055';


export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: baseURL }),
    endpoints: (builder) => ({
        // EXPENSE ENDPOINTS
        // Get expense categories
        getCategories: builder.query({
            query: () => '/api/categories',
            providesTags: ['categories']
        }),

        // Get expense labels
        getLabels: builder.query({
            query: () => '/api/labels',
            providesTags: ['transaction']
        }),

        // Add expense transaction
        addTransaction: builder.mutation({
            query: (initialTransaction) => ({
                url: '/api/transaction',
                method: "POST",
                body: initialTransaction
            }),
            invalidatesTags: ['transaction']
        }),

        // Update expense transaction
        updateTransaction: builder.mutation({
            query: ({ _id, ...updatedData }) => ({
                url: `/api/transaction/${_id}`,
                method: "PUT",
                body: updatedData
            }),
            invalidatesTags: ['transaction']
        }),

        // Delete expense transaction
        deleteTransaction: builder.mutation({
            query: ({ _id }) => ({
                url: `/api/transaction/${_id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['transaction']
        }),

        // INCOME ENDPOINTS
        // Get income categories
        getIncomeCategories: builder.query({
            query: () => '/api/income-categories',
            providesTags: ['incomeCategories']
        }),

        // Get income labels
        getIncomeLabels: builder.query({
            query: () => '/api/income-labels',
            providesTags: ['incomeTransaction']
        }),

        // Add income transaction
        addIncomeTransaction: builder.mutation({
            query: (initialTransaction) => ({
                url: '/api/income-transaction',
                method: "POST",
                body: initialTransaction
            }),
            invalidatesTags: ['incomeTransaction']
        }),

        // Update income transaction
        updateIncomeTransaction: builder.mutation({
            query: ({ _id, ...updatedData }) => ({
                url: `/api/income-transaction/${_id}`,
                method: "PUT",
                body: updatedData
            }),
            invalidatesTags: ['incomeTransaction']
        }),

        // Delete income transaction
        deleteIncomeTransaction: builder.mutation({
            query: ({ _id }) => ({
                url: `/api/income-transaction/${_id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['incomeTransaction']
        })
    })
});

export const {
    // Expense hooks
    useGetCategoriesQuery,
    useGetLabelsQuery,
    useAddTransactionMutation,
    useUpdateTransactionMutation,
    useDeleteTransactionMutation,
    
    // Income hooks
    useGetIncomeCategoriesQuery,
    useGetIncomeLabelsQuery,
    useAddIncomeTransactionMutation,
    useUpdateIncomeTransactionMutation,
    useDeleteIncomeTransactionMutation
} = apiSlice;

export default apiSlice;