import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-20 px-4 flex items-center justify-center">
        <div className="text-center animate-fade-in max-w-md">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight font-sans">
            Product Not Found
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-16 px-6">
      <div className="container mx-auto max-w-6xl animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center bg-gray-100 hover:bg-gray-200 text-gray-900 py-2.5 px-5 rounded-xl shadow-sm transition-all duration-300 ease-in-out group focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          Back
        </button>
        <div className="bg-white rounded-2xl shadow-xl p-12 transform transition-all duration-300 hover:shadow-2xl">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight font-sans">
            {product.productName}
          </h1>
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <img
                src={
                  product.productImage
                    ? `http://localhost:5000/${product.productImage}`
                    : "https://via.placeholder.com/150"
                }
                alt={product.productName}
                className="w-full h-96 object-cover rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.02]"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/150")
                }
              />
            </div>
            <div className="md:w-1/2 flex flex-col justify-center">
              <p className="text-2xl font-semibold text-indigo-600 mb-6">
                Price: ${product.productPrice}
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                <span className="font-semibold text-gray-800">
                  Description:
                </span>{" "}
                {product.productDescription || "No description available."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
