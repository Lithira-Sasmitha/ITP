import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const machineapiSlice = createApi({
  reducerPath: "machineApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  tagTypes: ["Machine"],
  endpoints: (builder) => ({
    getMachines: builder.query({
      query: () => "/machines",
      providesTags: ["Machine"],
    }),
    createMachine: builder.mutation({
      query: (newMachine) => ({
        url: "/machines",
        method: "POST",
        body: newMachine,
      }),
      invalidatesTags: ["Machine"],
    }),
    updateMachine: builder.mutation({
      query: ({ id, updatedMachine }) => ({
        url: `/machines/${id}`,
        method: "PUT",
        body: updatedMachine,
      }),
      invalidatesTags: ["Machine"],
    }),
    deleteMachine: builder.mutation({
      query: (id) => ({
        url: `/machines/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Machine"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          machineapiSlice.util.updateQueryData(
            "getMachines",
            undefined,
            (draft) => {
              if (Array.isArray(draft)) {
                const index = draft.findIndex((machine) => machine._id === id);
                if (index !== -1) {
                  draft.splice(index, 1);
                }
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo(); // Rollback on failure
          console.error("Delete failed:", error);
        }
      },
    }),
  }),
});

export const {
  useGetMachinesQuery,
  useCreateMachineMutation,
  useUpdateMachineMutation,
  useDeleteMachineMutation,
} = machineapiSlice;
