import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Product Not Found</h2>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="container mx-auto max-w-screen-md">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
        >
          Back
        </button>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.productName}
          </h1>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <img
                src={
                  product.productImage
                    ? `http://localhost:5000/${product.productImage}`
                    : "https://via.placeholder.com/150"
                }
                alt={product.productName}
                className="w-full h-64 object-cover rounded-md"
                onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
              />
            </div>
            <div className="md:w-1/2">
              <p className="text-xl font-semibold text-gray-800 mb-2">
                Price: ${product.productPrice}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-semibold">Description:</span>{" "}
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