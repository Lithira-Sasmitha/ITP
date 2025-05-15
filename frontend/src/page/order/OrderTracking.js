import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  GoogleMap,
  Marker,
  DirectionsService,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const GOOGLE_MAPS_API_KEY = "AIzaSyD_lhBUF7rZ651jBwwIn6ZTmnxD5_1zd1A";

// Hardcoded coordinates for simulated driver movement (from warehouse to destination)
const HARDCODED_PATH = [
  { lat: 6.9271, lng: 79.8612 }, // Warehouse (Colombo, Sri Lanka)
  { lat: 6.9285, lng: 79.862 },
  { lat: 6.93, lng: 79.8635 },
  { lat: 6.932, lng: 79.865 },
  { lat: 6.934, lng: 79.8665 },
  { lat: 6.936, lng: 79.868 },
  { lat: 6.938, lng: 79.8695 },
  { lat: 6.94, lng: 79.871 },
  { lat: 6.942, lng: 79.8725 },
  { lat: 6.944, lng: 79.874 },
  { lat: 6.946, lng: 79.8755 },
  { lat: 6.948, lng: 79.877 }, // Destination
];

// Validate coordinates
const isValidCoordinate = (lat, lng) => {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

const OrderTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [error, setError] = useState(null);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [directions, setDirections] = useState(null);
  const [shouldFetchDirections, setShouldFetchDirections] = useState(true);

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Fetch order and delivery data from backend
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrderData = async () => {
      try {
        setLoading(true);
        setError(null);

        const orderResponse = await axios.get(`${API_URL}/orders/${orderId}`);
        const order = orderResponse.data;

        const deliveryResponse = await axios.get(`${API_URL}/deliveries`);
        const delivery = deliveryResponse.data.find(
          (d) => d.orderId === orderId
        );

        const statusHistory = [
          {
            status: "Order Placed",
            date: new Date(order.createdAt).toLocaleString(),
            completed: true,
          },
          {
            status: "Processing",
            date: new Date(order.updatedAt).toLocaleString(),
            completed:
              order.status === "processing" || order.status === "delivered",
          },
          {
            status: "Shipped",
            date: delivery
              ? new Date(
                  delivery.driverAssignmentDate || delivery.createdAt
                ).toLocaleString()
              : "Pending",
            completed: delivery && delivery.deliveryStatus !== "Pending",
          },
          {
            status: "Out for Delivery",
            date:
              delivery && delivery.deliveryStatus === "Delayed"
                ? new Date(delivery.updatedAt).toLocaleString()
                : "Pending",
            completed: delivery && delivery.deliveryStatus === "Delayed",
          },
          {
            status: "Delivered",
            date:
              delivery && delivery.deliveryStatus === "Completed"
                ? new Date(delivery.completedAt).toLocaleString()
                : "Pending",
            completed: delivery && delivery.deliveryStatus === "Completed",
          },
        ];

        setOrderStatus({
          id: orderId,
          status:
            delivery?.deliveryStatus ||
            order.status.charAt(0).toUpperCase() + order.status.slice(1),
          estimatedDelivery: delivery?.completedAt
            ? new Date(delivery.completedAt).toLocaleDateString()
            : "Pending",
          lastUpdated: new Date(
            delivery?.updatedAt || order.updatedAt
          ).toLocaleString(),
          statusHistory,
          currentLocation: {
            lat: HARDCODED_PATH[0].lat,
            lng: HARDCODED_PATH[0].lng,
            address: delivery?.assignedDriver
              ? "Driver en route"
              : "Warehouse Facility, Colombo",
          },
          destinationAddress:
            order.address || "1234 Customer Street, Colombo, Sri Lanka",
          destination: { lat: 6.948, lng: 79.877 },
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching order data:", err);
        setError(
          "Failed to load order tracking information. Please try again."
        );
        setLoading(false);

        setOrderStatus({
          id: orderId,
          status: "Processing",
          estimatedDelivery: "March 25, 2025",
          lastUpdated: "March 22, 2025 - 10:30 AM",
          statusHistory: [
            {
              status: "Order Placed",
              date: "March 22, 2025 - 9:15 AM",
              completed: true,
            },
            {
              status: "Processing",
              date: "March 22, 2025 - 10:30 AM",
              completed: true,
            },
            { status: "Shipped", date: "March 23, 2025", completed: false },
            {
              status: "Out for Delivery",
              date: "March 24, 2025",
              completed: false,
            },
            { status: "Delivered", date: "March 25, 2025", completed: false },
          ],
          currentLocation: {
            lat: HARDCODED_PATH[0].lat,
            lng: HARDCODED_PATH[0].lng,
            address: "Warehouse Facility, Colombo",
          },
          destinationAddress: "1234 Customer Street, Colombo, Sri Lanka",
          destination: { lat: 6.948, lng: 79.877 },
        });
      }
    };

    fetchOrderData();

    const interval = setInterval(fetchOrderData, 30000);
    return () => clearInterval(interval);
  }, [orderId]);

  // Simulate live tracking by updating currentLocation
  useEffect(() => {
    if (!orderStatus || orderStatus.status === "Delivered") return;

    const moveDriver = () => {
      setCurrentPathIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= HARDCODED_PATH.length) {
          return prevIndex;
        }

        const nextLocation = HARDCODED_PATH[nextIndex];
        if (!isValidCoordinate(nextLocation.lat, nextLocation.lng)) {
          console.error("Invalid coordinates in HARDCODED_PATH:", nextLocation);
          return prevIndex;
        }

        setOrderStatus((prevStatus) => ({
          ...prevStatus,
          currentLocation: {
            lat: nextLocation.lat,
            lng: nextLocation.lng,
            address:
              nextIndex === HARDCODED_PATH.length - 1
                ? "Approaching Destination"
                : `Driver en route (Point ${nextIndex + 1})`,
          },
        }));

        setShouldFetchDirections(true); // Trigger DirectionsService on location update
        return nextIndex;
      });
    };

    const moveInterval = setInterval(moveDriver, 5000);
    return () => clearInterval(moveInterval);
  }, [orderStatus]);

  // Directions callback for rendering route
  const directionsCallback = useCallback((response) => {
    if (response !== null) {
      if (response.status === "OK") {
        setDirections(response);
        setMapError(null); // Clear error on successful route
        const route = response.routes[0];
        const leg = route.legs[0];
        document.getElementById("distance").textContent = leg.distance.text;
        document.getElementById("duration").textContent = leg.duration.text;
      } else {
        console.error("Directions request failed:", response.status, response);
        setMapError(
          `Failed to calculate route: ${response.status}. Please try again.`
        );
        setDirections(null); // Clear directions to avoid stale data
      }
    } else {
      console.error("Directions response is null");
      setMapError("Failed to calculate route: No response from server.");
      setDirections(null);
    }
    setShouldFetchDirections(false); // Prevent further calls until next update
  }, []);

  // Google Maps component
  const GoogleMapComponent = () => {
    if (loadError) {
      console.error("Google Maps API load error:", loadError);
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-red-600 text-center">
            Failed to load Google Maps. Please check your API key or network
            connection.
          </p>
        </div>
      );
    }

    if (!isLoaded) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading map...</p>
        </div>
      );
    }

    const mapContainerStyle = {
      width: "100%",
      height: "256px",
    };

    const center = orderStatus
      ? {
          lat:
            (orderStatus.currentLocation.lat + orderStatus.destination.lat) / 2,
          lng:
            (orderStatus.currentLocation.lng + orderStatus.destination.lng) / 2,
        }
      : { lat: 6.9271, lng: 79.8612 };

    return (
      <div className="relative">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={14}
          onLoad={() => console.log("Google Map loaded successfully")}
          onError={(error) =>
            console.error("Google Map rendering error:", error)
          }
        >
          {orderStatus &&
            isValidCoordinate(
              orderStatus.currentLocation.lat,
              orderStatus.currentLocation.lng
            ) &&
            isValidCoordinate(
              orderStatus.destination.lat,
              orderStatus.destination.lng
            ) && (
              <>
                {/* Current Location Marker */}
                <Marker
                  position={{
                    lat: orderStatus.currentLocation.lat,
                    lng: orderStatus.currentLocation.lng,
                  }}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                  title="Current Location"
                />

                {/* Destination Marker */}
                <Marker
                  position={{
                    lat: orderStatus.destination.lat,
                    lng: orderStatus.destination.lng,
                  }}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                  title="Destination"
                />

                {/* Directions */}
                {shouldFetchDirections && (
                  <DirectionsService
                    options={{
                      origin: {
                        lat: orderStatus.currentLocation.lat,
                        lng: orderStatus.currentLocation.lng,
                      },
                      destination: {
                        lat: orderStatus.destination.lat,
                        lng: orderStatus.destination.lng,
                      },
                      travelMode: "DRIVING",
                    }}
                    callback={directionsCallback}
                  />
                )}

                {directions && (
                  <DirectionsRenderer
                    options={{
                      directions: directions,
                      suppressMarkers: true,
                      polylineOptions: {
                        strokeColor: "#22c55e",
                        strokeWeight: 5,
                        strokeOpacity: 0.7,
                      },
                    }}
                  />
                )}
              </>
            )}
        </GoogleMap>
        {mapError && (
          <div className="absolute top-2 left-2 bg-red-100 text-red-600 p-2 rounded-lg text-sm">
            {mapError}
          </div>
        )}
        <div className="mt-4 bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center mb-2">
            <div className="h-3 w-3 rounded-full bg-blue-600 mr-2"></div>
            <p className="text-sm font-medium">Current Location:</p>
          </div>
          <p className="text-sm text-gray-600 ml-5">
            {orderStatus?.currentLocation.address}
          </p>
          <div className="flex items-center mt-3 mb-2">
            <div className="h-3 w-3 rounded-full bg-red-600 mr-2"></div>
            <p className="text-sm font-medium">Destination:</p>
          </div>
          <p className="text-sm text-gray-600 ml-5">
            {orderStatus?.destinationAddress}
          </p>
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="flex flex-col">
              <span className="text-gray-700">
                Distance: <span id="distance">Calculating...</span>
              </span>
              <span className="text-gray-700">
                ETA: <span id="duration">Calculating...</span>
              </span>
            </div>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              Live Tracking
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Error state
  if (error) {
    return (
      <>
        <div className="min-h-screen bg-green-100 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700">{error}</p>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                setOrderStatus(null);
              }}
              className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  // No orderId state
  if (!orderId) {
    return (
      <>
        <div className="min-h-screen bg-green-100 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700">
              Order ID not found. Please try again.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              Return to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gray-600 px-6 py-4">
          <h2 className="text-center text-2xl font-bold text-white">
            Track Your Order
          </h2>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="text-lg font-medium">{orderId}</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="text-green-600 hover:text-green-700"
            >
              Back to Order
            </button>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading order information...</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold">Current Status</h3>
                  <span className="text-sm text-gray-500">
                    Last Updated: {orderStatus.lastUpdated}
                  </span>
                </div>
                <div className="bg-green-50 rounded-lg p-4 flex items-center">
                  <div className="bg-green-600 rounded-full p-2 mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      {orderStatus.status}
                    </p>
                    <p className="text-gray-600">
                      Estimated Delivery: {orderStatus.estimatedDelivery}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Live Order Tracking
                </h3>
                <GoogleMapComponent />
              </div>
              <h3 className="text-xl font-semibold mb-4">Delivery Progress</h3>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gray-300 before:zindex-1">
                {orderStatus.statusHistory.map((step, index) => (
                  <div
                    key={index}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      {step.completed ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <span className="text-sm">{index + 1}</span>
                      )}
                    </div>
                    <div className="w-full md:w-5/12 p-4 rounded-lg bg-gray-50">
                      <div className="font-bold">{step.status}</div>
                      <div className="text-gray-600 text-sm">{step.date}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => window.print()}
                  className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  Print Receipt
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => navigate("/support", { state: { orderId } })}
                  className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition"
                >
                  Need Help?
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
