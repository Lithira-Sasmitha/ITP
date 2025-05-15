// Import the apiSlice object, which contains the base configurations for API interactions.
import { apiSlice } from  "./apiSlice";

// Import the DRIVER_URL constant that holds the base URL for driver-related API endpoints.
import { DRIVER_URL } from "../constants";

// Extend the apiSlice by injecting driver-related endpoints.
export const driverApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Define an endpoint to fetch all drivers.
    getDrivers: builder.query({
      // Specify the endpoint URL to fetch all drivers.
      query: () => `${DRIVER_URL}`,
      // Use "Driver" as a tag for caching and invalidation.
      providesTags: ["Driver"],
    }),

    // Define an endpoint to fetch a driver by their unique ID.
    getDriverById: builder.query({
      // Use a dynamic URL to fetch a specific driver using their ID.
      query: (driverId) => `${DRIVER_URL}/${driverId}`,
      // Provide caching and invalidation for this specific driver ID.
      providesTags: (result, error, driverId) => [
        { type: "Driver", id: driverId },
      ],
    }),

    // Define an endpoint to create a new driver.
    createDriver: builder.mutation({
      // Specify the URL, HTTP method, headers, and request body for creating a driver.
      query: (driverData) => ({
        url: `${DRIVER_URL}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: driverData, // Pass the new driver's data as the request body.
      }),
      // Handle cache invalidation and error handling when creating a driver.
      async onQueryStarted(driverData, { dispatch, queryFulfilled }) {
        try {
          // Wait for the mutation query to complete successfully.
          await queryFulfilled;
          // Invalidate "Driver" tags to refresh driver-related data in the cache.
          dispatch(apiSlice.util.invalidateTags(["Driver"]));
        } catch (error) {
          // Log any error that occurs during the creation process.
          console.log("Error creating driver:", error);
          // Throw an error to inform the user about the unsuccessful operation.
          throw new Error("Adding unsuccessful. Please try again.");
        }
      },
    }),

    // Define an endpoint to update an existing driver's details.
    updateDriver: builder.mutation({
      // Specify the URL, HTTP method, and request body for updating a driver.
      query: ({ id, ...driverData }) => ({
        url: `${DRIVER_URL}/${id}`, // Use the driver's ID in the URL.
        method: "PUT", // Use the PUT method to update the driver's data.
        body: driverData, // Pass the updated driver's data as the request body.
      }),
      // Invalidate the cache for this specific driver after the update.
      invalidatesTags: (result, error, { driverId }) => [
        { type: "Driver", id: driverId },
      ],
    }),

    // Define an endpoint to delete a driver by their ID.
    deleteDriver: builder.mutation({
      // Specify the URL and HTTP method for deleting a driver.
      query: (driverId) => ({
        url: `${DRIVER_URL}/${driverId}`, // Use the driver's ID in the URL.
        method: "DELETE", // Use the DELETE method to remove the driver.
      }),
      // Invalidate the "Driver" tags to refresh the driver data in the cache.
      invalidatesTags: ["Driver"],
    }),
  }),
});

// Export React hooks automatically generated for each endpoint.
// These hooks simplify interacting with the respective API endpoints in components.
export const {
  useGetDriversQuery, // Hook to fetch all drivers.
  useGetDriverByIdQuery, // Hook to fetch a specific driver by ID.
  useCreateDriverMutation, // Hook to create a new driver.
  useUpdateDriverMutation, // Hook to update an existing driver.
  useDeleteDriverMutation, // Hook to delete a driver by ID.
} = driverApiSlice;
//RTK Query integration: Helps manage API calls, caching, and state automatically with less boilerplate.
// builder.query vs builder.mutation: Queries are for fetching data, while mutations are for creating, updating, or deleting data.
// providesTags and invalidatesTags: Ensures the cache is correctly updated or invalidated when data changes, enabling automatic re-fetching.
// Generated hooks: Simplify component logic by providing ready-to-use hooks to interact with the API.