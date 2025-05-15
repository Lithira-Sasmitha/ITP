import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../../page/machine/redux/api/productapiSlice";
import axios from "axios";

const Product = () => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [finalProducts, setFinalProducts] = useState([]);
  const navigate = useNavigate();
  const { data: products, isLoading, error } = useGetProductsQuery();

  // Fetch final products
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/finalProduct")
      .then((response) => {
        setFinalProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching final products:", error);
      });
  }, []);

  const handleAddToCart = (product) => {
    const finalProduct = finalProducts.find(
      (fp) => fp.name === product.productName
    );
    if (!finalProduct || finalProduct.status === "Out of Stock") {
      alert("This product is out of stock!");
      return;
    }

    // Check if product is already in cart
    const isAlreadyInCart = cartItems.some(
      (item) => item.name === product.productName
    );
    if (isAlreadyInCart) {
      return; // Do nothing if product is already in cart
    }

    setCartItems((prevItems) => [
      ...prevItems,
      {
        name: product.productName,
        price: product.productPrice,
        imageUrl: product.productImage
          ? `http://localhost:5000/${product.productImage}`
          : "https://via.placeholder.com/150",
        quantity: 1,
      },
    ]);
    setCartCount(cartCount + 1); // Increment cartCount by 1 for new item
  };

  const handleRemoveFromCart = (productName) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.name === productName);
      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
        setCartCount(cartCount - 1); // Decrement cartCount by 1
        return [...prevItems];
      } else {
        setCartCount(cartCount - (existingItem ? existingItem.quantity : 0)); // Remove total quantity of item
        return prevItems.filter((item) => item.name !== productName);
      }
    });
  };

  const handleViewDetails = (product) => {
    navigate(`/product/${product.productName}`, { state: { product } });
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const isCheckoutDisabled = () => {
    return cartItems.some((item) => {
      const finalProduct = finalProducts.find((fp) => fp.name === item.name);
      return !finalProduct || finalProduct.status === "Out of Stock";
    });
  };

  const handleCheckout = () => {
    if (isCheckoutDisabled()) {
      alert("Cannot checkout: some products are out of stock!");
      return;
    }
    const deliveryPrice = 5;
    const total = calculateTotal() + deliveryPrice;
    navigate("/placeorder", { state: { cartItems, deliveryPrice, total } });
    setShowCartModal(false);
  };

  const toggleCartModal = () => {
    setShowCartModal(!showCartModal);
  };

  // Function to handle + button in cart modal
  const handleIncreaseQuantity = (productName) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.name === productName) {
          const finalProduct = finalProducts.find(
            (fp) => fp.name === item.name
          );
          if (!finalProduct || finalProduct.status === "Out of Stock") {
            alert("This product is out of stock!");
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      setCartCount(cartCount + 1); // Increment cartCount by 1
      return updatedItems;
    });
  };

  if (isLoading)
    return <div className="text-center py-10">Loading products...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        Error loading products: {error.message}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="container mx-auto max-w-screen-xl">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Our Exclusive Products
          </h1>
          <div className="relative">
            <button
              className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300"
              onClick={toggleCartModal}
            >
              Cart
            </button>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-6 h-6 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {products?.map((product, index) => {
            const finalProduct = finalProducts.find(
              (fp) => fp.name === product.productName
            );
            const isOutOfStock =
              !finalProduct || finalProduct.status === "Out of Stock";
            const isInCart = cartItems.some(
              (item) => item.name === product.productName
            );
            return (
              <div
                key={index}
                className={`relative bg-white border-2 border-black rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ${
                  isOutOfStock ? "opacity-50" : ""
                }`}
              >
                {isOutOfStock && (
                  <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-center py-2 rounded-t-lg font-semibold">
                    Out of Stock
                  </div>
                )}
                <img
                  src={
                    product.productImage
                      ? `http://localhost:5000/${product.productImage}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={product.productName}
                  className="w-full h-48 object-cover rounded-t-lg"
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/150")
                  }
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {product.productName}
                  </h3>
                  <p className="text-lg text-gray-600">
                    ${product.productPrice}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`bg-green-500 text-white px-6 py-2 rounded-lg transition-all ${
                        isOutOfStock || isInCart
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-green-600"
                      }`}
                      disabled={isOutOfStock || isInCart}
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleViewDetails(product)}
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showCartModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="flex justify-between items-center border-b p-4">
                <h1 className="text-2xl font-bold text-green-800">
                  Shopping Cart
                </h1>
                <button
                  onClick={toggleCartModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {cartItems.length > 0 ? (
                  <div>
                    {cartItems.map((item, index) => {
                      const finalProduct = finalProducts.find(
                        (fp) => fp.name === item.name
                      );
                      const isOutOfStock =
                        !finalProduct || finalProduct.status === "Out of Stock";
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between py-4 border-b"
                        >
                          <div className="flex items-center">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-md mr-4"
                              onError={(e) =>
                                (e.target.src =
                                  "https://via.placeholder.com/150")
                              }
                            />
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {item.name}
                              </h3>
                              <p className="text-gray-600">
                                ${item.price} x {item.quantity}
                              </p>
                              {isOutOfStock && (
                                <p className="text-red-500 text-sm">
                                  Out of Stock
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <button
                                onClick={() => handleRemoveFromCart(item.name)}
                                className="bg-red-100 hover:bg-red-200 text-red-700 p-1 rounded"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                              <span className="mx-2">{item.quantity}</span>
                              <button
                                onClick={() =>
                                  handleIncreaseQuantity(item.name)
                                }
                                className={`bg-green-100 text-green-700 p-1 rounded ${
                                  isOutOfStock
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-green-200"
                                }`}
                                disabled={isOutOfStock}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                            <button
                              onClick={() =>
                                handleViewDetails({
                                  productName: item.name,
                                  productPrice: item.price,
                                  productImage: item.imageUrl,
                                })
                              }
                              className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition-all"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    <div className="py-4 border-b">
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="pt-4 flex justify-between">
                      <button
                        onClick={toggleCartModal}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
                      >
                        Continue Shopping
                      </button>
                      <button
                        onClick={handleCheckout}
                        className={`bg-green-600 text-white py-2 px-4 rounded transition-all ${
                          isCheckoutDisabled()
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-green-700"
                        }`}
                        disabled={isCheckoutDisabled()}
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mx-auto text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p className="mt-4 text-gray-600">Your cart is empty</p>
                    <button
                      onClick={toggleCartModal}
                      className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                    >
                      Continue Shopping
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
