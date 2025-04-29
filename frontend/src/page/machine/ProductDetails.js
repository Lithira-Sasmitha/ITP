import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-16 px-4 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 tracking-tight">
            Product Not Found
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-12 px-4">
      <div className="container mx-auto max-w-screen-md animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out group"
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
        <div className="bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-3xl">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
            {product.productName}
          </h1>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <img
                src={
                  product.productImage
                    ? `http://localhost:5000/${product.productImage}`
                    : "https://via.placeholder.com/150"
                }
                alt={product.productName}
                className="w-full h-80 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/150")
                }
              />
            </div>
            <div className="md:w-1/2">
              <p className="text-2xl font-semibold text-emerald-600 mb-4">
                Price: ${product.productPrice}
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                <span className="font-semibold text-gray-700">
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
