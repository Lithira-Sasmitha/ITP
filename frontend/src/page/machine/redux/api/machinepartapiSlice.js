import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const machinepartapiSlice = createApi({
  reducerPath: "machinepartApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  tagTypes: ["MachinePart"],
  endpoints: (builder) => ({
    getParts: builder.query({
      query: () => "/machineParts", // Adjust to your machine parts endpoint
      providesTags: ["MachinePart"],
    }),
    createPart: builder.mutation({
      query: (newPart) => ({
        url: "/machineparts", // Adjust to your machine parts creation endpoint
        method: "POST",
        body: newPart,
      }),
      invalidatesTags: ["MachinePart"],
    }),
    updatePart: builder.mutation({
      query: ({ id, updatedPart }) => ({
        url: `/machineparts/${id}`, // Adjust to your machine part update endpoint
        method: "PUT",
        body: updatedPart,
      }),
      invalidatesTags: ["MachinePart"],
    }),
    deletePart: builder.mutation({
      query: (id) => ({
        url: `/machineParts/${id}`, // Adjust to your machine part delete endpoint
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          machinepartapiSlice.util.updateQueryData(
            "getParts",
            undefined,
            (draft) => {
              const index = draft.findIndex((part) => part.id === id);
              if (index !== -1) {
                draft.splice(index, 1); // Remove the deleted part from the local cache
              }
            }
          )
        );
        try {
          await queryFulfilled; // Wait for the mutation to complete
        } catch (error) {
          patchResult.undo(); // Revert the cache update if the mutation fails
        }
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
