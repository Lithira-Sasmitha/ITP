import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  tagTypes: ["Driver"], // Define tags to enable caching & invalidation
  endpoints: (builder) => ({
    getDrivers: builder.query({
      query: () => "/drivers",
      providesTags: ["Driver"],
    }),
    createDriver: builder.mutation({
      query: (newDriver) => ({
        url: "/drivers",
        method: "POST",
        body: newDriver,
      }),
      invalidatesTags: ["Driver"],
    }),
    updateDriver: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/drivers/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["Driver"],
    }),
    deleteDriver: builder.mutation({
      query: (id) => ({
        url: `/drivers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Driver"],
    }),
  }),
});

// Export hooks
export const {
  useGetDriversQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
} = apiSlice;


