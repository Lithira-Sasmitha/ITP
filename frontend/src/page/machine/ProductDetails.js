import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Smooth scroll to top when component mounts
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 py-20 px-4 flex items-center justify-center">
        <div className="text-center transform transition-all duration-500 ease-in-out">
          <div className="mb-8">
            <svg
              className="w-16 h-16 mx-auto text-indigo-500 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-indigo-900 mb-6 tracking-tight">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Sorry, we couldn't find the product you're looking for. It may have
            been removed or doesn't exist.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl flex items-center mx-auto"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-100 py-16 px-6">
      <div className="container mx-auto max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center bg-white hover:bg-gray-100 text-indigo-800 py-2 px-6 rounded-full shadow-md transition duration-300 ease-in-out group"
        >
          <svg
            className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Products
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl">
          <div className="flex flex-col lg:flex-row">
            {/* Product Image Section */}
            <div className="lg:w-1/2 relative overflow-hidden">
              <div
                className={`absolute inset-0 bg-indigo-100 flex items-center justify-center transition-opacity duration-300 ${
                  imageLoaded ? "opacity-0" : "opacity-100"
                }`}
              >
                <svg
                  className="w-16 h-16 text-indigo-300 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <img
                src={
                  product.productImage
                    ? `http://localhost:5000/${product.productImage}`
                    : "https://via.placeholder.com/800x600"
                }
                alt={product.productName}
                className={`w-full h-full object-cover object-center transition-all duration-700 ${
                  imageLoaded ? "scale-100" : "scale-105 blur-sm"
                }`}
                style={{ minHeight: "400px" }}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x600";
                  setImageLoaded(true);
                }}
              />
              <div className="absolute top-4 right-4">
                <span className="bg-indigo-600 text-white text-sm font-bold py-2 px-4 rounded-full shadow-lg">
                  ${product.productPrice}
                </span>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="lg:w-1/2 p-8 lg:p-12">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center mb-4">
                    <div className="h-1 w-10 bg-indigo-600 rounded mr-2"></div>
                    <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider">
                      Product Details
                    </span>
                  </div>

                  <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                    {product.productName}
                  </h1>

                  <div className="flex items-center mb-6">
                    <span className="text-3xl font-bold text-indigo-700">
                      ${product.productPrice}
                    </span>
                   
                    
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.productDescription ||
                        "No description available for this premium product. Please contact our customer support for more information."}
                    </p>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Product Highlights
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-center text-gray-600">
                        <svg
                          className="w-4 h-4 text-indigo-500 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Premium Quality Materials
                      </li>
                      <li className="flex items-center text-gray-600">
                        <svg
                          className="w-4 h-4 text-indigo-500 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        1 Year Warranty
                      </li>
                      <li className="flex items-center text-gray-600">
                        <svg
                          className="w-4 h-4 text-indigo-500 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Free Shipping Available
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
