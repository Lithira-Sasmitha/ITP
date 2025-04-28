import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Hardcoded coordinates for simulated driver movement (from warehouse to destination)
const HARDCODED_PATH = [
  { lat: 34.052235, lng: -118.243683 }, // Warehouse
  { lat: 34.0535, lng: -118.245 },
  { lat: 34.055, lng: -118.2465 },
  { lat: 34.057, lng: -118.248 },
  { lat: 34.059, lng: -118.25 },
  { lat: 34.061, lng: -118.252 },
  { lat: 34.063, lng: -118.254 },
  { lat: 34.065, lng: -118.256 },
  { lat: 34.067, lng: -118.258 },
  { lat: 34.069, lng: -118.26 },
  { lat: 34.071, lng: -118.262 },
  { lat: 34.0736, lng: -118.4004 }, // Destination
];

const OrderTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  let map; // Map instance

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
              : "Warehouse Facility, Los Angeles",
          },
          destinationAddress:
            order.address || "1234 Customer Street, Beverly Hills, CA 90210",
          destination: { lat: 34.0736, lng: -118.4004 },
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
            address: "Warehouse Facility, Los Angeles",
          },
          destinationAddress: "1234 Customer Street, Beverly Hills, CA 90210",
          destination: { lat: 34.0736, lng: -118.4004 },
        });
      }
    };

    fetchOrderData();

    const interval = setInterval(fetchOrderData, 30000);
    return () => clearInterval(interval);
  }, [orderId]);

  // Simulate live tracking by updating currentLocation
  useEffect(() => {
    if (!orderStatus || !mapLoaded || orderStatus.status === "Delivered")
      return;

    const moveDriver = () => {
      setCurrentPathIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= HARDCODED_PATH.length) {
          return prevIndex;
        }

        setOrderStatus((prevStatus) => ({
          ...prevStatus,
          currentLocation: {
            lat: HARDCODED_PATH[nextIndex].lat,
            lng: HARDCODED_PATH[nextIndex].lng,
            address:
              nextIndex === HARDCODED_PATH.length - 1
                ? "Approaching Destination"
                : `Driver en route (Point ${nextIndex + 1})`,
          },
        }));

        return nextIndex;
      });
    };

    const moveInterval = setInterval(moveDriver, 5000);
    return () => clearInterval(moveInterval);
  }, [orderStatus, mapLoaded]);

  // Initialize Google Maps
  const initMap = async () => {
    console.log("Initializing Google Maps...");
    try {
      // Load the Maps library
      const { Map } = await window.google.maps.importLibrary("maps");
      const mapContainer = document.getElementById("google-map");

      if (!mapContainer) {
        console.error("Map container (#google-map) not found in DOM");
        setMapError(
          "Map container not found. Please check the page structure."
        );
        return;
      }

      // Initialize map with center between currentLocation and destination
      map = new Map(mapContainer, {
        center: orderStatus
          ? {
              lat:
                (orderStatus.currentLocation.lat +
                  orderStatus.destination.lat) /
                2,
              lng:
                (orderStatus.currentLocation.lng +
                  orderStatus.destination.lng) /
                2,
            }
          : { lat: 34.052235, lng: -118.243683 }, // Fallback center
        zoom: 12,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
      });

      console.log("Map initialized successfully");
      setMapLoaded(true);
    } catch (err) {
      console.error("Failed to initialize Google Maps:", err);
      setMapError(
        "Failed to load Google Maps. Please check your API key or network connection."
      );
    }
  };

  // Render markers and route
  const renderMap = async () => {
    if (!mapLoaded || !orderStatus || !map) {
      console.log(
        "Cannot render map: mapLoaded, orderStatus, or map not ready",
        { mapLoaded, orderStatus, map }
      );
      return;
    }

    console.log(
      "Rendering map with currentLocation:",
      orderStatus.currentLocation
    );
    try {
      // Load Marker and Directions libraries
      const { Marker } = await window.google.maps.importLibrary("marker");
      const { DirectionsService, DirectionsRenderer } =
        await window.google.maps.importLibrary("routes");

      // Add markers
      new Marker({
        position: {
          lat: orderStatus.currentLocation.lat,
          lng: orderStatus.currentLocation.lng,
        },
        map: map,
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
        },
        title: "Current Location",
      });

      new Marker({
        position: {
          lat: orderStatus.destination.lat,
          lng: orderStatus.destination.lng,
        },
        map: map,
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
        },
        title: "Destination",
      });

      // Render route
      const directionsService = new DirectionsService();
      const directionsRenderer = new DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#22c55e",
          strokeWeight: 5,
          strokeOpacity: 0.7,
        },
      });

      directionsService.route(
        {
          origin: {
            lat: orderStatus.currentLocation.lat,
            lng: orderStatus.currentLocation.lng,
          },
          destination: {
            lat: orderStatus.destination.lat,
            lng: orderStatus.destination.lng,
          },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK") {
            console.log("Directions API response received:", response);
            directionsRenderer.setDirections(response);
            const route = response.routes[0];
            const leg = route.legs[0];
            document.getElementById("distance").textContent = leg.distance.text;
            document.getElementById("duration").textContent = leg.duration.text;
          } else {
            console.error("Directions API failed:", status);
            setMapError(
              "Failed to calculate route. Please check the API key or coordinates."
            );
          }
        }
      );
    } catch (err) {
      console.error("Failed to render map markers or route:", err);
      setMapError(
        "Failed to render map content. Please check the API key or network connection."
      );
    }
  };

  // Load Google Maps script and initialize map
  useEffect(() => {
    console.log("Loading Google Maps script...");
    const loadGoogleMaps = async () => {
      if (!window.google) {
        const googleMapScript = document.createElement("script");
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
        googleMapScript.async = true;
        googleMapScript.defer = true;
        googleMapScript.onerror = () => {
          console.error("Failed to load Google Maps script");
          setMapError(
            "Failed to load Google Maps. Please check your API key or network connection."
          );
        };
        if (googleMapScript.src.includes("YOUR_API_KEY")) {
          console.warn(
            "Replace 'YOUR_API_KEY' with a valid Google Maps API key"
          );
        }
        window.document.body.appendChild(googleMapScript);
        googleMapScript.addEventListener("load", async () => {
          console.log("Google Maps script loaded successfully");
          await initMap();
        });
      } else {
        console.log("Google Maps API already loaded");
        await initMap();
      }
    };

    loadGoogleMaps();
  }, []);

  // Render map when orderStatus or mapLoaded changes
  useEffect(() => {
    if (mapLoaded && orderStatus) {
      console.log("Triggering renderMap");
      renderMap();
    }
  }, [mapLoaded, orderStatus]);

  // Google Maps component
  const GoogleMap = () => {
    if (mapError) {
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
          <p className="mt-4 text-red-600 text-center">{mapError}</p>
          <p className="mt-2 text-gray-600 text-sm">
            Ensure you have a valid Google Maps API key and network connection.
          </p>
        </div>
      );
    }

    if (!mapLoaded) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading map...</p>
        </div>
      );
    }

    return (
      <div className="relative">
        <div
          id="google-map"
          className="h-64 bg-gray-100 rounded-lg"
          style={{ width: "100%", minHeight: "256px" }}
        ></div>
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
    );
  }

  // No orderId state
  if (!orderId) {
    return (
      <div className="min-h-screen bg-green-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">Order ID not found. Please try again.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Return to Home
          </button>
        </div>
      </div>
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
                <GoogleMap />
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
