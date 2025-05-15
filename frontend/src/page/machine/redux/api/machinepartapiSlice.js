import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const machinepartapiSlice = createApi({
  reducerPath: "machinepartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["MachinePart"],
  endpoints: (builder) => ({
    getParts: builder.query({
      query: () => "/machineparts",
      providesTags: ["MachinePart"],
      transformResponse: (response) => {
        if (!response.success) {
          throw new Error(response.message || "Failed to fetch parts");
        }
        return response.data;
      },
    }),
    createPart: builder.mutation({
      query: (newPart) => ({
        url: "/machineparts",
        method: "POST",
        body: newPart,
      }),
      invalidatesTags: ["MachinePart"],
      transformResponse: (response) => {
        if (!response.success) {
          throw new Error(response.message || "Failed to create part");
        }
        return response.data;
      },
    }),
    updatePart: builder.mutation({
      query: ({ id, updatedPart }) => ({
        url: `/machineparts/${id}`,
        method: "PUT",
        body: updatedPart,
      }),
      invalidatesTags: ["MachinePart"],
      transformResponse: (response) => {
        if (!response.success) {
          throw new Error(response.message || "Failed to update part");
        }
        return response.data;
      },
    }),
    deletePart: builder.mutation({
      query: (id) => ({
        url: `/machineparts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MachinePart"],
      transformResponse: (response) => {
        if (!response.success) {
          throw new Error(response.message || "Failed to delete part");
        }
        return response.data;
      },
    }),
  }),
});

export const {
  useGetPartsQuery,
  useCreatePartMutation,
  useUpdatePartMutation,
  useDeletePartMutation,
} = machinepartapiSlice;
