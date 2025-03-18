import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const baseURL = 'http://localhost:5005';

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: baseURL }),
    endpoints: (builder) => ({  
        // Get categories
        getCategories: builder.query({
            query: () => '/api/categories',
            providesTags:['categories']
        }),  
 
        // Get labels
        getLabels: builder.query({
            query: () => '/api/labels',
            providesTags:['transaction']
        }),

        // Add Transaction
        addTransaction: builder.mutation({
            query: (initialTransaction) => ({
                url: '/api/transaction',
                method: "POST",
                body: initialTransaction
            }),
            invalidatesTags:['transaction']
        }),

        // Update Transaction
        updateTransaction: builder.mutation({
            query: ({ _id, ...updatedData }) => ({
                url: `/api/transaction/${_id}`,
                method: "PUT",
                body: updatedData
            }),
            invalidatesTags:['transaction']
        }),

        // Delete Transaction
        deleteTransaction: builder.mutation({
            query: (recordId) => ({
                url: '/api/transaction',
                method: "DELETE",
                body: recordId
            }),
            invalidatesTags:['transaction']
        })
    })
});

export const { useGetCategoriesQuery,
               useGetLabelsQuery, 
               useAddTransactionMutation, 
               useUpdateTransactionMutation, 
               useDeleteTransactionMutation } = apiSlice;
 export default apiSlice;
